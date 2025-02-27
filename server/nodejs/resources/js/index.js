const config = require('./config.js');
const API = config.API_URL

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#searchInput');
    const unpublishedContainer = document.querySelector('#unpublishedSurveys');
    const publishedContainer = document.querySelector('#publishedSurveys');
    const cardDashboard = document.querySelector('.card-dashboard');

    // Survey Data Example (Replace with data from API if necessary)
    const surveyData = [
        {
            survey_id: 1,
            survey_title: 'Sample Survey 1',
            status: 'unpublished',
            program_id: 1,
            period_start: '2023-12-31T16:00:00.000Z',
            period_end: '2024-12-30T16:00:00.000Z',
            total_responded: 1,
            total_responders: 2
        },
        {
            survey_id: 2,
            survey_title: 'Sample Survey 2',
            status: 'unpublished',
            program_id: 2,
            period_start: '2024-01-01T08:00:00.000Z',
            period_end: '2024-01-31T17:00:00.000Z',
            total_responded: 10,
            total_responders: 50
        },
        {
            survey_id: 3,
            survey_title: 'Sample Survey 3',
            status: 'published',
            program_id: 2,
            period_start: '2023-02-03T08:00:00.000Z',
            period_end: '2024-01-31T17:00:00.000Z',
            total_responded: 20,
            total_responders: 40
        }
    ];

    // Initialize app on DOM load
    (async () => {
        const surveys = await fetchSurveys();
        if (surveys) {
            searchInput.addEventListener('input', debounce(() => searchSurveys(surveys), 300));
            renderCards(surveys);
            renderSurveys(surveys);
        }
    })();

    // Fetch surveys from API or static data (for demo purposes)
    async function fetchSurveys() {
        const url = `${API}/survey-service/survey-summary`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Response status: ${response.status}`);
            const json = await response.json();
            sessionStorage.setItem('surveysSummaryData', JSON.stringify(json));
            return json;
        } catch (error) {
            console.error(error.message);
            return surveyData; // Fallback to static data if API fails
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
        data.forEach(({survey_id, survey_title, total_responded, total_responders, period_start, period_end}) => {
            const periodStart = new Date(period_start)
            const periodEnd = new Date(period_end)
            var status = periodStart > currentDate ? 'unpublished' : 'published'
            var status = periodEnd < currentDate ? 'Survey Done' : status
            const container = status === 'unpublished' ? unpublishedContainer : publishedContainer;
            const isUnpublished = status === 'unpublished';
            const action = isUnpublished ? 'Edit' : 'Details';

            const surveyItem = document.createElement('div');
            const href = isUnpublished ? `/admin/surveys/edit?survey_id=${survey_id}` : `/admin/dashboard/survey`;

            surveyItem.className = 'survey-item';
            surveyItem.innerHTML = `
                <span class="survey-title">${survey_title}</span>
                <span class="survey-respondents">(${total_responded}/${total_responders})</span>
                <div class="status ${status}">
                    <span class="survey-status">${capitalize(status)}</span>
                </div>
                <a id="temp" class="${isUnpublished ? 'edit-btn' : 'details-btn'}">
                    <button data-id="${survey_id}">
                        <img src="/static/images/${action}.png" alt="${action} Icon" />
                    </button>
                </a>
            `;

            surveyItem.querySelector('#temp').addEventListener('click', (function (survey_id) {
                return function (event) {
                    event.preventDefault();
                    fetch(`${API}/survey-service/questions/${survey_id}`)
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
        });
    }

    document.body.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;  // Exit if not a button

        const surveyId = button.dataset.id;

        if (button.classList.contains('details-btn')) {
            showPreview(surveyId);
        }
    });


    // Debounced search function to filter surveys based on user input
    function debounce(func, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Search function to filter surveys
    function searchSurveys(surveyData) {
        const query = searchInput.value.trim().toLowerCase();
        const filteredSurveys = query ? surveyData.filter(survey => {
            const matchesTitle = survey.survey_title.toLowerCase().includes(query);
            const matchesDescription = survey.survey_description.toLowerCase().includes(query);
            const matchesStatus = (survey.status ? survey.status.toLowerCase() : '').includes(query);
            const matchesResponderCount = `${survey.total_responded}/${survey.total_responders}`.includes(query);
            const matchesProgramId = survey.program_id.toString().includes(query);
            const matchesPeriodStart = survey.period_start.toLowerCase().includes(query);
            const matchesPeriodEnd = survey.period_end.toLowerCase().includes(query);

            return (
                matchesTitle ||
                matchesDescription ||
                matchesStatus ||
                matchesResponderCount ||
                matchesProgramId ||
                matchesPeriodStart ||
                matchesPeriodEnd
            );
        }) : surveyData;

        renderSurveys(filteredSurveys);
    }

    // Render surveys to DOM based on filtered data
    function renderSurveys(data) {
        unpublishedContainer.innerHTML = '';
        publishedContainer.innerHTML = '';
        const currentDate = new Date();

        data.forEach(({
                          survey_id,
                          survey_title,
                          status,
                          total_responded,
                          total_responders,
                          period_start,
                          period_end
                      }) => {
            const periodStartDate = new Date(period_start);
            const periodEndDate = new Date(period_end);
            let actualStatus = (periodStartDate > currentDate) ? 'unpublished' : 'published';
            actualStatus = (periodEndDate < currentDate) ? 'Survey Ended' : actualStatus;

            const container = actualStatus === 'unpublished' ? unpublishedContainer : publishedContainer;
            const isUnpublished = actualStatus === 'unpublished';
            const action = isUnpublished ? 'Edit' : 'Details';
            const href = isUnpublished ? `/admin/surveys/edit?survey_id=${survey_id}` : `details-btn`;
            const buttonAction = isUnpublished ? `href=${href}` : `onClick=showPreview(${survey_id})`;

            const surveyItem = document.createElement('div');
            surveyItem.className = 'survey-item';
            surveyItem.innerHTML = `
                <span class="survey-title">${survey_title}</span>
                <span class="survey-respondents">(${total_responded}/${total_responders})</span>
                <div class="status ${actualStatus}">
                    <span class="survey-status">${capitalize(actualStatus)}</span>
                </div>
                <a id="temp"  class="${isUnpublished ? 'edit-btn' : 'details-btn'}">
                    <button data-id="${survey_id}" ${buttonAction}>
                        <img src="/static/images/${action}.png" alt="${action} Icon" />
                    </button>
                </a>
            `;
            surveyItem.querySelector('#temp').addEventListener('click', (function (survey_id) {
                return function (event) {
                    event.preventDefault();
                    fetch(`${API}/survey-service/questions/${survey_id}`)
                        .then(response => response.json())
                        .then(surveyData => {
                            sessionStorage.setItem('questionnaireData', JSON.stringify(surveyData));
                            sessionStorage.setItem('surveyId', survey_id);
                            if (isUnpublished) {
                                window.location.href = href;
                            } else {
                                showPreview(survey_id);
                            }
                        })
                        .catch(error => console.error("Fetch error: ", error));
                };
            })(survey_id));

            container.appendChild(surveyItem);
        });
    }

    // Function to render dashboard cards with summarized data
    function renderCards(data) {
        const currentDate = new Date();

        const deployedSurveys = data.filter(survey => {
            const periodStartDate = new Date(survey.period_start);
            const periodEndDate = new Date(survey.period_end);

            return periodStartDate <= currentDate && periodEndDate >= currentDate;
        });

        const totalRespondedRatio = data.reduce((acc, survey) => acc + (survey.total_responded / survey.total_responders), 0) / data.length;
        const totalMissedSurveys = data.reduce((acc, survey) => acc + (survey.total_responders - survey.total_responded), 0);
        const publishedSurveysCount = deployedSurveys.length;

        const cardData = [
            {
                title: 'Overall Respondents for <br> Surveys Deployed',
                data: `${(totalRespondedRatio * 100).toFixed(1)}%`
            },
            {title: ' Total Missed<br>Survey Responses', data: totalMissedSurveys},
            {title: 'Surveys Deployed', data: publishedSurveysCount}
        ];

        cardDashboard.innerHTML = cardData.map(card => `
        <div class="card">
            <div class="card-data">${card.data}</div>
            <h3 class="card-title">${card.title}</h3>
        </div>
    `).join('');
    }

    // Capitalize the first letter of a string
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Show survey preview in the modal
    async function showPreview(surveyId) {
        const surveysSummaryData = JSON.parse(sessionStorage.getItem('surveysSummaryData') || '[]');
        const survey = surveysSummaryData.find(survey => survey.survey_id === parseInt(surveyId));

        if (!survey) {
            console.error('Survey not found');
            return;
        }

        document.getElementById('previewSurveyTitle').textContent = survey.survey_title;
        document.getElementById('previewProgramId').textContent = await getProgram(survey.program_id);
        document.getElementById('previewPeriodStart').textContent = survey.period_start;
        document.getElementById('previewPeriodEnd').textContent = survey.period_end;

        document.getElementById('previewModal').showModal();

    }

    async function getProgram(program_id) {
        const response = await fetch(`${API}/program-service/programs?program_id=${program_id}`)
        if (response.ok) {
            var responseJson = await response.json()
            console.log(`Program: ${responseJson}`)
            var programsArray = []
            for (let program of responseJson.availability) {
                console.log(program)
                programsArray.push(program.program_name)
            }
            console.log(programsArray)
            return programsArray
        }
    }

    // Close Modals and Overlay
    document.getElementById('closePreview').addEventListener('click', () => {
        document.getElementById('previewModal').close();
        document.getElementById('modalOverlay').style.display = 'none';
    });
});
