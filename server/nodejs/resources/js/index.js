document.addEventListener('DOMContentLoaded', () => {
    const surveyData = [
        {
            survey_id: 1,
            survey_title: 'Sample Survey 1',
            status: 'unpublished',
            program_id: 101,
            period_start: '2024-11-01T08:00:00',
            period_end: '2024-11-15T17:00:00',
            respondents: { current: 0, total: 50 }
        },
        {
            survey_id: 2,
            survey_title: 'Sample Survey 2',
            status: 'unpublished',
            program_id: 102,
            period_start: '2024-11-10T08:00:00',
            period_end: '2024-11-25T17:00:00',
            respondents: { current: 0, total: 50 }
        },
        {
            survey_id: 3,
            survey_title: 'Sample Survey 3',
            status: 'unpublished',
            program_id: 103,
            period_start: '2024-10-01T08:00:00',
            period_end: '2024-10-31T17:00:00',
            respondents: { current: 0, total: 30 }
        },
        {
            survey_id: 4,
            survey_title: 'Sample Survey 4',
            status: 'published',
            program_id: 103,
            period_start: '2024-10-01T08:00:00',
            period_end: '2024-10-31T17:00:00',
            respondents: { current: 50, total: 50 }
        },
        {
            survey_id: 5,
            survey_title: 'Sample Survey 5',
            status: 'published',
            program_id: 104,
            period_start: '2024-09-15T08:00:00',
            period_end: '2024-10-15T17:00:00',
            respondents: { current: 20, total: 40 }
        },
        {
            survey_id: 6,
            survey_title: 'Sample Survey 6',
            status: 'published',
            program_id: 104,
            period_start: '2024-10-15T08:00:00',
            period_end: '2024-11-15T17:00:00',
            respondents: { current: 30, total: 100 }
        }
    ];

    const cardData = [
        { title: 'Overall Respondents for <br> Surveys Deployed', data: 30/100 },
        { title: 'Overall Missed <br> Surveys Deployed', data: 5 },
        { title: 'Surveys Deployed', data: 3 }
    ];


    const searchInput = document.querySelector('#searchInput');
    const unpublishedContainer = document.querySelector('#unpublishedSurveys');
    const publishedContainer = document.querySelector('#publishedSurveys');
    const cardDashboard = document.querySelector('.card-dashboard');

    function renderSurveys(data) {
        unpublishedContainer.innerHTML = '';
        publishedContainer.innerHTML = '';

        data.forEach(survey => {
            const container = survey.status === 'unpublished' ? unpublishedContainer : publishedContainer;
            const surveyItem = document.createElement('div');
            surveyItem.className = 'survey-item';

            // Create the HTML content for each survey item
            surveyItem.innerHTML = `
        <span class="survey-title">${survey.survey_title}</span>
        <span class="survey-respondents">(${survey.respondents.current}/${survey.respondents.total})</span>
        <div class="status ${survey.status === 'published' ? 'published' : ''}">
            <span class="survey-status">${survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}</span>
        </div>
        <button data-id="${survey.survey_id}" class="${survey.status === 'unpublished' ? 'edit-btn' : 'details-btn'}">
            <img src="../../resources/images/${survey.status === 'unpublished' ? 'Edit' : 'Details'}.png" alt="${survey.status === 'unpublished' ? 'Edit' : 'Details'} Icon" />
        </button>
    `;

            container.appendChild(surveyItem);
        });
    }

    // TODO: Logic for the Three Cards (Below is just a test run)
    // Function to create and render cards
    function renderCards() {
        cardDashboard.innerHTML = ''; // Clear any previous cards

        cardData.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';

            // If it's card 1 (index 0), display dynamic current/total respondents for the most recent survey
            let displayData = card.data;
            if (index === 0) {
                // Find the most recent published survey
                const recentSurvey = surveyData
                    .filter(survey => survey.status === 'published') // Only published surveys
                    .sort((a, b) => new Date(b.period_end) - new Date(a.period_end))[0]; // Sort by most recent end date

                if (recentSurvey) {
                    // Display the current and total respondents for the most recent published survey
                    displayData = `${recentSurvey.respondents.current}/${recentSurvey.respondents.total}`;
                }
            }

            // Set the HTML content for each card
            cardElement.innerHTML = `
            <div class="card-data">${displayData}</div>
            <h3 class="card-title">${card.title}</h3>
        `;

            cardDashboard.appendChild(cardElement);
        });
    }

    // Call the renderCards function to generate and display the cards
    renderCards();

    function searchSurveys() {
        const query = searchInput.value.toLowerCase();
        const filtered = surveyData.filter(survey => survey.survey_title.toLowerCase().includes(query));
        renderSurveys(filtered);
    }

    searchInput.addEventListener('input', debounce(searchSurveys, 300));

    document.body.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;

        const surveyId = button.dataset.id;
        if (button.classList.contains('details-btn')) {
            showPreview(surveyId);
        } else if (button.classList.contains('edit-btn')) {
            // Redirect to survey edit page
            window.location.href = `survey-edit.html?survey_id=${surveyId}`;
        }
    });

    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function showPreview(surveyId) {
        const survey = surveyData.find(survey => survey.survey_id === parseInt(surveyId));
        if (!survey) return console.error('Survey not found');

        const formatDateTime = (dateTimeString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(dateTimeString).toLocaleString(undefined, options);
        };

        document.getElementById('previewSurveyTitle').textContent = survey.survey_title;
        document.getElementById('previewSurveyStatus').textContent = survey.status;
        document.getElementById('previewProgramId').textContent = survey.program_id;

        // Update these lines to show both date and time
        document.getElementById('previewPeriodStart').textContent = formatDateTime(survey.period_start);
        document.getElementById('previewPeriodEnd').textContent = formatDateTime(survey.period_end);

        document.getElementById('previewModal').showModal();
        document.getElementById('modalOverlay').style.display = 'block';
    }

    // Close Modals and Overlay
    document.getElementById('closePreview').addEventListener('click', () => {
        document.getElementById('previewModal').close();
        document.getElementById('modalOverlay').style.display = 'none';
    });

    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        sidebar.classList.toggle('hidden');
        mainContent.classList.toggle('full-width');
    }

    renderSurveys(surveyData);
});