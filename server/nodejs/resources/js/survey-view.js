document.addEventListener('DOMContentLoaded', () => {
    const surveyData = [
        {
            survey_id: 1,
            survey_title: 'Sample Survey 1',
            status: 'unpublished',
            program_id: 101,
            period_start: '2024-11-01',
            period_end: '2024-11-15'
        },
        {
            survey_id: 2,
            survey_title: 'Sample Survey 2',
            status: 'unpublished',
            program_id: 102,
            period_start: '2024-11-10',
            period_end: '2024-11-25'
        },
        {
            survey_id: 3,
            survey_title: 'Sample Survey 3',
            status: 'unpublished',
            program_id: 103,
            period_start: '2024-10-01',
            period_end: '2024-10-31'
        },
        {
            survey_id: 4,
            survey_title: 'Sample Survey 4',
            status: 'published',
            program_id: 103,
            period_start: '2024-10-01',
            period_end: '2024-10-31'
        },
        {
            survey_id: 5,
            survey_title: 'Sample Survey 5',
            status: 'published',
            program_id: 104,
            period_start: '2024-09-15',
            period_end: '2024-10-15'
        },
        {
            survey_id: 6,
            survey_title: 'Sample Survey 6',
            status: 'published',
            program_id: 104,
            period_start: '2024-10-15',
            period_end: '2024-23-15'
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

            // Create the HTML content for each survey item
            let buttonsHtml = '';

            // Add the appropriate buttons based on the survey's status
            if (survey.status === 'unpublished') {
                buttonsHtml = `
                <span>${survey.survey_title}</span>
                <button data-id="${survey.survey_id}" class="edit-btn">
                    <img src="../../resources/images/Edit.png" alt="Edit" />
                </button>
                <button data-id="${survey.survey_id}" class="delete-btn">
                    <img src="../../resources/images/Delete.png" alt="Delete" />
                </button>
            `;
            } else if (survey.status === 'published') {
                buttonsHtml = `
                <span>${survey.survey_title}</span>
                <button data-id="${survey.survey_id}" class="view-btn">
                    <img src="../../resources/images/Eye.png" alt="View" />
                </button>
                <button data-id="${survey.survey_id}" class="delete-btn">
                    <img src="../../resources/images/Delete.png" alt="Delete" />
                </button>
            `;
            }

            surveyItem.innerHTML = buttonsHtml;
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
            // Redirect to survey edit page
            window.location.href = `survey-edit.html?survey_id=${surveyId}`;
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