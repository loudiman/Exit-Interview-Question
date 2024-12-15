document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('welcome-message').textContent = `Welcome, ${sessionStorage.getItem('fname')}!`;

    let surveyData = [];

    // Fetch surveys data from the server
    async function fetchSurveys() {
        try {
            const response = await fetch('http://localhost:8888/student');
            const jsonString = await response.json();
            console.log(jsonString);
            surveyData = jsonString.surveys;
            console.log(surveyData);
            renderSurveys(surveyData);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        }
    }

    // Render surveys on the page
    function renderSurveys(surveys) {
        const surveyList = document.getElementById('survey-list');
        surveyList.innerHTML = ''; // Clear the list

        surveys.forEach(survey => {
            const surveyElement = document.createElement('div');
            surveyElement.classList.add('survey-item');

            const periodEndFormatted = formatDateToStandardTime(survey.period_end);
            const submittedAtFormatted = survey.responded == 1 ? formatDateToStandardTime(survey.submitted_at) : '';

            // Set different colors based on survey status and period end
            if (survey.responded == 1) {
                surveyElement.classList.add('green');
            }

            if (survey.responded == 0) {
                if (new Date() > new Date(survey.period_end)) {
                    surveyElement.classList.add('red'); // Missed
                } else if (new Date() < new Date(survey.period_end)) {
                    surveyElement.classList.add('yellow'); // Still valid
                }
            }

            surveyElement.innerHTML = `
                <div>
                    <div class="survey-title">${survey.survey_title}</div>
                    <div class="survey-info">
                        ${survey.responded == 1? `Time Submitted: ${submittedAtFormatted}` : survey.responded == 0 && new Date() < new Date(survey.period_end) ? `Valid Until: ${periodEndFormatted}` : `Submission Closed: ${periodEndFormatted}` }
                    </div>
                </div>
                <div class="survey-actions">
                    <button class="action-link">
                        ${survey.responded == 1 ? 'Check Details 📄' : survey.responded == 0 && new Date() < new Date(survey.period_end) ? 'Take Survey 📝' : 'Check Details 📄'}
                    </button>
                </div>
            `;

            // Handle button tag click to get data from db
            surveyElement.querySelector('.action-link').addEventListener('click', (function(survey) {
                return function(event) {
                    event.preventDefault();
                    sessionStorage.setItem('surveyId', survey.survey_id);

                    // This is a workaround solution to handle an expired survey
                    if (survey.responded == 1 || new Date(survey.period_end) < new Date()) {
                        window.location.href = '/student/survey/closedsurvey';
                    }

                    window.location.href = '/student/survey/viewsurvey?id=' + survey.survey_id;
                };
            })(survey));

            surveyList.appendChild(surveyElement);
        });
    }

    // Search functionality
    document.getElementById('search-button').addEventListener('click', () => {
        const searchQuery = document.getElementById('search-input').value.toLowerCase();
        const filteredSurveys = surveyData.filter(survey =>
            survey['survey-title'].toLowerCase().includes(searchQuery)
        );
        renderSurveys(filteredSurveys);
    });

    // Add "Enter" key listener for the search input
    document.getElementById('search-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {  // Check if the key pressed is "Enter"
            const searchQuery = document.getElementById('search-input').value.toLowerCase();
            const filteredSurveys = surveyData.filter(survey =>
                survey['survey_title'].toLowerCase().includes(searchQuery)
            );
            renderSurveys(filteredSurveys);
        }
    });

    // Filter functionality
    document.getElementById('survey-filter').addEventListener('change', (event) => {
        filterSurveys();
    });

    function filterSurveys() {
        const filterType = document.getElementById('survey-filter').value;
        let filteredSurveys = surveyData;

        if (filterType === 'completed') {
            filteredSurveys = surveyData.filter(survey => survey.responded);
        } else if (filterType === 'missed') {
            filteredSurveys = surveyData.filter(survey => !survey.responded && new Date() > new Date(survey.period_end));
        }

        renderSurveys(filteredSurveys);
    }

    // Initial fetch
    fetchSurveys();
});

function formatDateToStandardTime(dateInput) {
    // Handle both Date objects and date strings
    const dateToFormat = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // Check if date is valid
    return !isNaN(dateToFormat.getTime())
        ? dateToFormat.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        })
        : 'Invalid Date';
}
