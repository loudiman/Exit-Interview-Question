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

        data.forEach(({ survey_id, survey_title, status, total_responded, total_responders }) => {
            const container = status === 'unpublished' ? unpublishedContainer : publishedContainer;
            const isUnpublished = status === 'unpublished';
            const action = isUnpublished ? 'Edit' : 'Details';

            const surveyItem = document.createElement('div');
            const href = isUnpublished ? `/admin/surveys/edit?survey_id=${survey_id}` : `/admin/surveys/details?id=${survey_id}`;

            surveyItem.className = 'survey-item';
            surveyItem.innerHTML = `
                <span class="survey-title">${survey_title}</span>
                <span class="survey-respondents">(${total_responded}/${total_responders})</span>
                <div class="status ${status}">
                    <span class="survey-status">${capitalize(status)}</span>
                </div>
                <a href="${href}" class="${isUnpublished ? 'edit-btn' : 'details-btn'}">
                    <button data-id="${survey_id}">
                        <img src="/static/images/${action}.png" alt="${action} Icon" />
                    </button>  
                </a>
            `;

            container.appendChild(surveyItem);
        });
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