document.addEventListener('DOMContentLoaded', () => {
    // DOM Element Caching
    const searchInput = document.querySelector('#searchInput');
    const unpublishedContainer = document.querySelector('#unpublishedSurveys');
    const publishedContainer = document.querySelector('#publishedSurveys');

    // Improved Render Surveys Function
    function renderSurveys(data) {
        // Clear containers more efficiently
        unpublishedContainer.innerHTML = '';
        publishedContainer.innerHTML = '';

        data.forEach(survey => {
            const container = survey.status === 'unpublished' ? unpublishedContainer : publishedContainer;
            const surveyItem = document.createElement('div');
            surveyItem.className = 'survey-item';

            // Simplified button HTML generation
            const buttonsHtml = survey.status === 'unpublished'
                ? createUnpublishedSurveyHTML(survey)
                : createPublishedSurveyHTML(survey);

            surveyItem.innerHTML = buttonsHtml;
            container.appendChild(surveyItem);
        });
    }

    // Helper functions for HTML generation
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

    // Optimized Search Function
    function searchSurveys(surveys) {
        const query = searchInput.value.toLowerCase();
        const filtered = surveys.filter(survey =>
            survey.survey_title.toLowerCase().includes(query)
        );
        renderSurveys(filtered);
    }

    // Improved Debounce Function
    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Existing Modal Preview Function
    function showPreview(surveyId, surveys) {
        const survey = surveys.find(survey => survey.survey_id === parseInt(surveyId));
        if (!survey) return console.error('Survey not found');

        document.getElementById('previewSurveyTitle').textContent = survey.survey_title;
        document.getElementById('previewSurveyStatus').textContent = survey.status;
        document.getElementById('previewProgramId').textContent = survey.program_id;
        document.getElementById('previewPeriodStart').textContent = survey.period_start;
        document.getElementById('previewPeriodEnd').textContent = survey.period_end;

        document.getElementById('previewModal').showModal();
        document.getElementById('modalOverlay').style.display = 'block';
    }

    function showDeleteModal(surveyId, surveys) {
        const survey = surveys.find(survey => survey.survey_id === parseInt(surveyId));
        if (!survey) return console.error('Survey not found');

        document.getElementById('surveyTitle').textContent = survey.survey_title;
        document.getElementById('deleteModal').showModal();
        document.getElementById('modalOverlay').style.display = 'block';

        const confirmHandler = () => {
            deleteSurvey(surveyId, surveys);
            document.getElementById('deleteModal').close();
            document.getElementById('modalOverlay').style.display = 'none';
            document.getElementById('confirmDelete').removeEventListener('click', confirmHandler);
        };

        document.getElementById('confirmDelete').addEventListener('click', confirmHandler);
    }

    async function deleteSurvey(surveyId, surveys) {
        try {
            const response = await fetch(`http://localhost:2020/api/survey-service/survey/${surveyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const index = surveys.findIndex(survey => survey.survey_id === parseInt(surveyId));
            if (index !== -1) {
                surveys.splice(index, 1);
                renderSurveys(surveys);
                console.log(`Survey with ID ${surveyId} deleted.`);
            }
        } catch (error) {
            console.error('Failed to delete survey:', error.message);
            alert('Failed to delete survey. Please try again.');
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
            // Restore search event listener
            searchInput.addEventListener('input', debounce(() => searchSurveys(surveys), 300));

            document.body.addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (!button) return;

                const surveyId = button.dataset.id;

                if (button.classList.contains('details-btn')) {
                    showPreview(surveyId, surveys);
                } else if (button.classList.contains('view-btn')) {
                    window.location.href = `/admin/surveys/view?survey_id=${surveyId}`;
                } else if (button.classList.contains('edit-btn')) {
                    window.location.href = `/admin/surveys/edit?survey_id=${surveyId}`;
                } else if (button.classList.contains('delete-btn')) {
                    showDeleteModal(surveyId, surveys);
                }
            });

            document.getElementById('closePreview').addEventListener('click', () => {
                document.getElementById('previewModal').close();
                document.getElementById('modalOverlay').style.display = 'none';
            });

            document.getElementById('cancelDelete').addEventListener('click', () => {
                document.getElementById('deleteModal').close();
                document.getElementById('modalOverlay').style.display = 'none';
            });

            renderSurveys(surveys);
        }
    })();
});