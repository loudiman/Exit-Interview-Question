document.addEventListener('DOMContentLoaded', () => {
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

    const searchInput = document.querySelector('#searchInput');
    const unpublishedContainer = document.querySelector('#unpublishedSurveys');
    const publishedContainer = document.querySelector('#publishedSurveys');

    function renderSurveys(data) {
        unpublishedContainer.innerHTML = '';
        publishedContainer.innerHTML = '';

        data.forEach(survey => {
            const container = survey.status === 'unpublished' ? unpublishedContainer : publishedContainer;
            const surveyItem = document.createElement('div');
            surveyItem.className = 'survey-item';

            // Create the HTML content for each survey item
            let buttonsHtml = '';

            // Add the appropriate buttons based on the survey's status
            if (survey.status === 'unpublished') {
                buttonsHtml = `
                <span>${survey.survey_title}</span>
                <a href="/admin/surveys/edit">
                    <button data-id="${survey.survey_id}" class="edit-btn">
                        <img src="/static/images/Edit.png" alt="Edit" />
                    </button>              
                </a>
                <button data-id="${survey.survey_id}" class="delete-btn">
                    <img src="/static/images/Delete.png" alt="Delete" />
                </button>
            `;
            } else if (survey.status === 'published') {
                buttonsHtml = `
                <span>${survey.survey_title}</span>
                <button data-id="${survey.survey_id}" class="view-btn">
                    <img src="/static/images/Eye.png" alt="View" />
                </button>
                <button data-id="${survey.survey_id}" class="details-btn">
                    <img src="/static/images/Details.png" alt="Delete" />
                </button>
            `;
            }

            surveyItem.innerHTML = buttonsHtml;
            container.appendChild(surveyItem);
        });
    }

    /**
     * Filters surveys based on the search input and renders the filtered results.
     */
    function searchSurveys() {
        const query = searchInput.value.toLowerCase();
        const filtered = surveyData.filter(survey =>
            survey.survey_title.toLowerCase().includes(query)
        );
        renderSurveys(filtered);
    }

// Add a debounce listener to the search input
    searchInput.addEventListener('input', debounce(searchSurveys, 300));

    /**
     * Handles button clicks on the survey list using a switch statement.
     */
    document.body.addEventListener('click', event => {
        // Find the closest button element from the click event target
        const button = event.target.closest('button');
        if (!button) return; // Exit if the click is not on a button

        // Retrieve the survey ID from the button's dataset
        const surveyId = button.dataset.id;

        // Use a switch statement to handle button actions based on their class
        switch (true) {
            case button.classList.contains('details-btn'):
                showPreview(surveyId);
                break;

            case button.classList.contains('view-btn'):
                // TODO: Redirect to Viewing
                console.log(`View survey ${surveyId}`); // Placeholder for viewing functionality
                break;

            case button.classList.contains('edit-btn'):
                // Redirect to the survey edit page
                window.location.href = `survey-edit.html?survey_id=${surveyId}`;
                break;

            case button.classList.contains('delete-btn'):
                // Show the delete confirmation modal
                showDeleteModal(surveyId);
                break;

            default:
                console.warn('Unhandled button action:', button.className);
                break;
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

        document.getElementById('previewSurveyTitle').textContent = survey.survey_title;
        document.getElementById('previewSurveyStatus').textContent = survey.status;
        document.getElementById('previewProgramId').textContent = survey.program_id;
        document.getElementById('previewPeriodStart').textContent = survey.period_start;
        document.getElementById('previewPeriodEnd').textContent = survey.period_end;

        document.getElementById('previewModal').showModal();
        document.getElementById('modalOverlay').style.display = 'block';
    }

    function showDeleteModal(surveyId) {
        const survey = surveyData.find(survey => survey.survey_id === parseInt(surveyId));
        if (!survey) return console.error('Survey not found');

        document.getElementById('surveyTitle').textContent = survey.survey_title;
        document.getElementById('deleteModal').showModal();
        document.getElementById('modalOverlay').style.display = 'block';

        document.getElementById('confirmDelete').onclick = () => {
            deleteSurvey(surveyId);
            document.getElementById('deleteModal').close();
            document.getElementById('modalOverlay').style.display = 'none';
        };
    }

    // Delete survey function
    function deleteSurvey(surveyId) {
        const index = surveyData.findIndex(survey => survey.survey_id === parseInt(surveyId));
        if (index !== -1) {
            surveyData.splice(index, 1); // Remove the survey from the array
            renderSurveys(surveyData); // Re-render surveys to update the UI
            console.log(`Survey with ID ${surveyId} deleted.`);
        }
    }

    // Close Modals and Overlay
    document.getElementById('closePreview').addEventListener('click', () => {
        document.getElementById('previewModal').close();
        document.getElementById('modalOverlay').style.display = 'none';
    });

    document.getElementById('cancelDelete').addEventListener('click', () => {
        document.getElementById('deleteModal').close();
        document.getElementById('modalOverlay').style.display = 'none';
    });

    renderSurveys(surveyData);
});