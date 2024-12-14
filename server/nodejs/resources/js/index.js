document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.querySelector('#searchInput');
    const unpublishedContainer = document.querySelector('#unpublishedSurveys');
    const publishedContainer = document.querySelector('#publishedSurveys');
    const cardDashboard = document.querySelector('.card-dashboard');

    //search function with multiple filtering options
    function searchSurveys(surveyData) {
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            renderSurveys(surveyData);
            return;
        }

        const filteredSurveys = surveyData.filter(survey => {
            const matchesTitle = survey.survey_title.toLowerCase().includes(query);
            const matchesStatus = survey.status.toLowerCase().includes(query);
            const matchesResponderCount = `${survey.total_responded}/${survey.total_responders}`.includes(query);
            const matchesProgramId = survey.program_id.toString().includes(query);

            return matchesTitle || matchesStatus || matchesResponderCount || matchesProgramId;
        });

        renderSurveys(filteredSurveys);
    }

    // Function to render surveys based on the filtered data
    function renderSurveys(data) {
        unpublishedContainer.innerHTML = '';
        publishedContainer.innerHTML = '';
        const currentDate = new Date()

        for (const {survey_id, survey_title, status, total_responded, total_responders, period_start, period_end} of data) {
        
            const periodStartDate = new Date(period_start)
            const periodEndDate = new Date(period_end)
            var actualStatus = periodStartDate > currentDate ? 'unpublished' : 'published'
            var actualStatus = periodEndDate < currentDate ? 'Survey Ended': actualStatus
            console.log(`Actual status ${actualStatus} with survey id ${survey_id}`)
            const container = actualStatus === 'unpublished' ? unpublishedContainer : publishedContainer;
            const isUnpublished = actualStatus === 'unpublished';
            console.log(actualStatus === 'unpublished');
            const action = isUnpublished ? 'Edit' : 'Details';


            console.log(`${survey_id}`);
            const surveyItem = document.createElement('div');
            const href = isUnpublished ? `/admin/surveys/edit?survey_id=${survey_id}` : `/admin/surveys/details?id=${survey_id}`;

            surveyItem.className = 'survey-item';
            surveyItem.innerHTML = `
                <span class="survey-title">${survey_title}</span>
                <span class="survey-respondents">(${total_responded}/${total_responders})</span>
                <div class="status ${actualStatus}">
                    <span class="survey-status">${capitalize(actualStatus)}</span>
                </div>
                <a id="temp" href="${href}" class="${isUnpublished ? 'edit-btn' : 'details-btn'}">
                    <button data-id="${survey_id}">
                        <img src="/static/images/${action}.png" alt="${action} Icon" />
                    </button>  
                </a>
            `;

            surveyItem.querySelector('#temp').addEventListener('click', (function(survey_id) {
                return function(event) {
                    event.preventDefault();
                    fetch(`http://localhost:2020/api/survey-service/questions/${survey_id}`)
                    .then(response => response.json())
                    .then(surveyData => {
                        console.log(JSON.stringify(surveyData));
                        sessionStorage.setItem('questionnaireData', JSON.stringify(surveyData));
                        sessionStorage.setItem('surveyId', survey_id);
                        window.location.href = href;
                    })
                    .catch(error => console.error("Fetch error: ", error));
                };
            })(survey_id));

            container.appendChild(surveyItem);
        }
    }

    // Function to render the dashboard cards with specific data
    function renderCards(data) {
        //Total Responders for all Surveys
        const totalRespondedRatio = data.reduce((acc, survey) => {
            return acc + (survey.total_responded / survey.total_responders);
        }, 0) / data.length;

        //overall missed surveys
        const totalMissedSurveys = data.reduce((acc, survey) => {
            return acc + (survey.total_responders - survey.total_responded);
        }, 0);

        //published surveys
        const publishedSurveysCount = data.filter(survey => survey.status === 'published').length;

        const cardData = [
            {
                title: 'Overall Respondents for <br> Surveys Deployed',
                data: `${(totalRespondedRatio * 100).toFixed(1)}%`
            },
            {
                title: 'Overall Missed <br> Surveys Deployed',
                data: totalMissedSurveys
            },
            {
                title: 'Surveys Deployed',
                data: publishedSurveysCount
            }
        ];

        cardDashboard.innerHTML = cardData.map((card) => `
        <div class="card">
            <div class="card-data">${card.data}</div>
            <h3 class="card-title">${card.title}</h3>
        </div>
    `).join('');
    }

    // Debounce function to limit the number of searches
    function debounce(func, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Function to fetch surveys from the server
    async function fetchSurveys() {
        const url = "http://localhost:2020/api/survey-service/survey-summary";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            sessionStorage.setItem('surveysSummaryData', JSON.stringify(json));
            console.log(json);
            return json;
        } catch (error) {
            console.error(error.message);
        }
    }

    (async () => {
        const surveys = await fetchSurveys();
        if (surveys) {
            searchInput.addEventListener('input', debounce(() => searchSurveys(surveys), 300));

            renderCards(surveys);
            renderSurveys(surveys);
        }
    })();

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});