document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#searchInput');
    const unpublishedContainer = document.querySelector('#unpublishedSurveys');
    const publishedContainer = document.querySelector('#publishedSurveys');

    // Global variable to store surveys and current survey for deletion
    let surveys = [];
    let currentSurveyToDelete = null;

    function renderSurveys(data) {
        unpublishedContainer.innerHTML = '';
        publishedContainer.innerHTML = '';

        data.forEach(survey => {
            const container = survey.status === 'unpublished' ? unpublishedContainer : publishedContainer;
            const surveyItem = document.createElement('div');
            surveyItem.className = 'survey-item';

            const buttonsHtml = survey.status === 'unpublished'
                ? createUnpublishedSurveyHTML(survey)
                : createPublishedSurveyHTML(survey);

            surveyItem.innerHTML = buttonsHtml;
            container.appendChild(surveyItem);
        });
    }

    function createUnpublishedSurveyHTML(survey) {
        return `
            <span>${survey.survey_title}</span>
            <a href="/admin/surveys/edit?survey_id=${survey.survey_id}">
                <button data-id="${survey.survey_id}" class="edit-btn">
                    <img src="/static/images/Edit.png" alt="Edit" />
                </button>              
            </a>
            <button data-survey-id="${survey.survey_id}" class="delete-btn">
                <img src="/static/images/Delete.png" alt="Delete" />
            </button>
        `;
    }

    function createPublishedSurveyHTML(survey) {
        return `
            <span>${survey.survey_title}</span>
            <button data-id="${survey.survey_id}" class="view-btn">
                <img src="/static/images/Eye.png" alt="View" />
            </button>
            <button data-id="${survey.survey_id}" class="details-btn">
                <img src="/static/images/Details.png" alt="Details" />
            </button>
        `;
    }

    function showDeleteModal(survey) {
        currentSurveyToDelete = survey;

        document.getElementById('surveyTitle').textContent = survey.survey_title;
        document.getElementById('deleteModal').showModal();
        document.getElementById('modalOverlay').style.display = 'block';
    }

    async function deleteSurvey() {
        if (!currentSurveyToDelete) {
            console.error('No survey selected for deletion');
            return;
        }

        const surveyId = currentSurveyToDelete.survey_id;

        try {
            const response = await fetch(`http://localhost:2020/api/survey-service/survey/${surveyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }

            // Remove the survey from the local array
            surveys = surveys.filter(survey => survey.survey_id !== surveyId);

            // Re-render surveys
            renderSurveys(surveys);

            // Close modal
            document.getElementById('deleteModal').close();
            document.getElementById('modalOverlay').style.display = 'none';

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Survey deleted successfully';
            document.body.insertBefore(successMessage, document.body.firstChild);

            setTimeout(() => successMessage.remove(), 3000);

        } catch (error) {
            console.error('Error deleting survey:', error);

            const errorMessage = document.createElement('div');

            setTimeout(() => errorMessage.remove(), 5000);
        }
    }

    async function fetchSurveys() {
        const url = "http://localhost:2020/api/survey-service/survey-summary";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            surveys = await response.json();
            return surveys;
        } catch (error) {
            console.error('Failed to fetch surveys:', error.message);
            return [];
        }
    }

    // Initialize the application
    (async () => {
        surveys = await fetchSurveys();

        if (surveys.length) {
            // Event delegation for survey interactions
            document.body.addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (!button) return;

                if (button.classList.contains('delete-btn')) {
                    const surveyId = button.getAttribute('data-survey-id');
                    const survey = surveys.find(s => s.survey_id === parseInt(surveyId));
                    if (survey) {
                        showDeleteModal(survey);
                    }
                } else if (button.classList.contains('details-btn')) {
                    const surveyId = button.dataset.id;
                    window.location.href = `/admin/survey/details?id=${surveyId}`;
                } else if (button.classList.contains('view-btn')) {
                    const surveyId = button.dataset.id;
                    window.location.href = `/admin/surveys/view?survey_id=${surveyId}`;
                } else if (button.classList.contains('edit-btn')) {
                    const surveyId = button.dataset.id;
                    window.location.href = `/admin/surveys/edit?survey_id=${surveyId}`;
                }
            });

            document.getElementById('confirmDelete').addEventListener('click', deleteSurvey);

            document.getElementById('cancelDelete').addEventListener('click', () => {
                document.getElementById('deleteModal').close();
                const modalOverlay = document.getElementById('modalOverlay');
                if (modalOverlay) {
                    modalOverlay.style.display = 'none';
                }
                currentSurveyToDelete = null;
            });

            renderSurveys(surveys);
        }
    })();
});