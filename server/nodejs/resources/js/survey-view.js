document.addEventListener('DOMContentLoaded', () => {
    const surveyData = [
        {
            survey_id: 1,
            survey_title: 'Employee Satisfaction',
            status: 'unpublished',
            program_id: 101,
            period_start: '2024-11-01',
            period_end: '2024-11-15'
        },
        {
            survey_id: 2,
            survey_title: 'Tech Conference Feedback',
            status: 'unpublished',
            program_id: 102,
            period_start: '2024-11-10',
            period_end: '2024-11-25'
        },
        {
            survey_id: 3,
            survey_title: 'Workshop Evaluation',
            status: 'published',
            program_id: 103,
            period_start: '2024-10-01',
            period_end: '2024-10-31'
        },
        {
            survey_id: 4,
            survey_title: 'Annual Review',
            status: 'published',
            program_id: 104,
            period_start: '2024-09-15',
            period_end: '2024-10-15'
        },
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
            surveyItem.innerHTML = `
                <span>${survey.survey_title}</span>
                <button data-id="${survey.survey_id}" class="view-btn">👁️</button>
                <button data-id="${survey.survey_id}" class="edit-btn">✏️</button>
                <button data-id="${survey.survey_id}" class="delete-btn">🗑️</button>
            `;
            container.appendChild(surveyItem);
        });
    }

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
        if (button.classList.contains('view-btn')) {
            showPreview(surveyId);
        } else if (button.classList.contains('edit-btn')) {
            // TODO: Redirect to survey edit page
        } else if (button.classList.contains('delete-btn')) {
            showDeleteModal(surveyId);
        }
    });

    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    renderSurveys(surveyData);
});

function showPreview(surveyId) {
    const survey = surveyData.find(survey => survey.survey_id === parseInt(surveyId));
    if (!survey) {
        console.error('Survey not found');
        return;
    }

    // Populate the preview modal with survey details
    document.getElementById('previewSurveyTitle').textContent = survey.survey_title;
    document.getElementById('previewSurveyStatus').textContent = survey.status;
    document.getElementById('previewProgramId').textContent = survey.program_id;
    document.getElementById('previewPeriodStart').textContent = survey.period_start;
    document.getElementById('previewPeriodEnd').textContent = survey.period_end;

    // Show the modal
    const previewModal = document.getElementById('previewModal');
    previewModal.showModal();
}

// Close the preview modal
document.getElementById('closePreview').addEventListener('click', () => {
    const previewModal = document.getElementById('previewModal');
    previewModal.close();
});

function showDeleteModal(surveyId) {
    const survey = surveyData.find(survey => survey.survey_id === parseInt(surveyId));
    if (!survey) {
        console.error('Survey not found');
        return;
    }

    // Populate the delete modal with survey title
    document.getElementById('surveyTitle').textContent = survey.survey_title;

    // Show the modal
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.showModal();

    // Attach confirm delete functionality
    const confirmDelete = document.getElementById('confirmDelete');
    confirmDelete.onclick = () => {
        deleteSurvey(surveyId);
        deleteModal.close();
    };
}

// Close the delete modal
document.getElementById('cancelDelete').addEventListener('click', () => {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.close();
});

function deleteSurvey(surveyId) {
    const index = surveyData.findIndex(survey => survey.survey_id === parseInt(surveyId));
    if (index !== -1) {
        // TODO LOGIC TO REMOVE SURVEY FROM DATABASE
        surveyData.splice(index, 1); // Remove the survey
        console.log(`Survey with ID ${surveyId} deleted.`);
    }
}



