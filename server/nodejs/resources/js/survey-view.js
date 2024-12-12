document.addEventListener('DOMContentLoaded', () => {
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

    function showDeleteModal(surveyId, surveys) {
        const survey = surveys.find(survey => survey.survey_id === parseInt(surveyId));
        if (!survey) return console.error('Survey not found');

        document.getElementById('surveyTitle').textContent = survey.survey_title;
        document.getElementById('deleteModal').showModal();
        document.getElementById('modalOverlay').style.display = 'block';

        const confirmDelete = document.getElementById('confirmDelete');
        const cancelDelete = document.getElementById('cancelDelete');

        confirmDelete.dataset.surveyId = surveyId;
    }

    async function deleteSurvey(event) {
        event.preventDefault();

        const surveyId = event.currentTarget.dataset.surveyId;

        try {
            const response = await fetch(`waiting for the goat`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }

            const updatedSurveys = surveys.filter(survey =>
                survey.survey_id !== parseInt(surveyId)
            );

            surveys.length = 0;
            surveys.push(...updatedSurveys);

            renderSurveys(surveys);

            document.getElementById('deleteModal').close();
            document.getElementById('modalOverlay').style.display = 'none';

            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Survey deleted successfully';
            document.body.insertBefore(successMessage, document.body.firstChild);

            setTimeout(() => successMessage.remove(), 3000);

        } catch (error) {
            console.error('Error deleting survey:', error);

            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            errorMessage.textContent = `Failed to delete survey: ${error.message}`;
            document.body.insertBefore(errorMessage, document.body.firstChild);

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

            const surveys = await response.json();
            console.log(surveys);
            return surveys;
        } catch (error) {
            console.error('Failed to fetch surveys:', error.message);
            return [];
        }
    }

    (async () => {
        const surveys = await fetchSurveys();
        if (surveys.length) {
            searchInput.addEventListener('input', debounce(() => searchSurveys(surveys), 300));
            document.body.addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (!button) return;

                const surveyId = button.dataset.id;

                if (button.classList.contains('details-btn')) {
                    window.location.href = `/admin/survey/details?id=${surveyId}`;
                } else if (button.classList.contains('view-btn')) {
                    window.location.href = `/admin/surveys/view?survey_id=${surveyId}`;
                } else if (button.classList.contains('edit-btn')) {
                    window.location.href = `/admin/surveys/edit?survey_id=${surveyId}`;
                } else if (button.classList.contains('delete-btn')) {
                    showDeleteModal(surveyId, surveys);
                }
            });

            document.getElementById('confirmDelete').addEventListener('click', deleteSurvey);
            document.getElementById('cancelDelete').addEventListener('click', () => {
                document.getElementById('deleteModal').close();
                document.getElementById('modalOverlay').style.display = 'none';
            });
            document.getElementById('closePreview').addEventListener('click', () => {
                document.getElementById('previewModal').close();
                document.getElementById('modalOverlay').style.display = 'none';
            });

            renderSurveys(surveys);
        }
    })();
});