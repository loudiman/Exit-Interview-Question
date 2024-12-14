document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#searchInput');
    const unpublishedContainer = document.querySelector('#unpublishedSurveys');
    const publishedContainer = document.querySelector('#publishedSurveys');

    // Global variables to store surveys and current survey for deletion
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
            <button data-id="${survey.survey_id}" class="delete-btn">
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

    function searchSurveys(surveys) {
        const query = searchInput.value.toLowerCase();
        const filtered = surveys.filter(survey =>
            survey.survey_title.toLowerCase().includes(query)
        );
        renderSurveys(filtered);
    }

    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function showDeleteModal(surveyId) {
        currentSurveyToDelete = surveys.find(survey => survey.survey_id === parseInt(surveyId));
        if (!currentSurveyToDelete) return console.error('Survey not found');

        document.getElementById('surveyTitle').textContent = currentSurveyToDelete.survey_title;
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

            // Update surveys array and re-render
            surveys = surveys.filter(survey => survey.survey_id !== surveyId);
            renderSurveys(surveys);

            // Close modal
            document.getElementById('deleteModal').close();
            document.getElementById('modalOverlay').style.display = 'none';

            setTimeout(() => successMessage.remove(), 3000);
        } catch (error) {
            console.error('Error deleting survey:', error);
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
            searchInput.addEventListener('input', debounce(() => searchSurveys(surveys), 300));

            // Event delegation for survey interactions
            document.body.addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (!button) return;

                const surveyId = button.dataset.id;

                if (button.classList.contains('delete-btn')) {
                    showDeleteModal(surveyId);
                } else if (button.classList.contains('details-btn')) {
                    window.location.href = `/admin/dashboard/survey?id=${surveyId}`;
                } else if (button.classList.contains('view-btn')) {
                    window.location.href = `/admin/surveys/view?survey_id=${surveyId}`;
                } else if (button.classList.contains('edit-btn')) {
                    window.location.href = `/admin/surveys/edit?survey_id=${surveyId}`;
                }
            });

            document.getElementById('confirmDelete').addEventListener('click', deleteSurvey);

            document.getElementById('cancelDelete').addEventListener('click', () => {
                document.getElementById('deleteModal').close();
                document.getElementById('modalOverlay').style.display = 'none';
                currentSurveyToDelete = null;
            });

            renderSurveys(surveys);
        }
    })();
});
