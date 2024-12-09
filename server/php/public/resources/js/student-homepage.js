document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        console.log('Logout button found');
        // logoutBtn.addEventListener('click', logout);
    }

    let surveyData = [];
    let hiddenSurveys = []; // Array to track hidden survey IDs

    // Fetch surveys data from the server
    async function fetchSurveys() {
        try {
            // const jsonString = {
            //     "surveys": [
            //         {
            //             "survey_id": 4,
            //             "survey_title": "Test 1",
            //             "responded": 1,
            //             "period-end": "2024-11-17 18:24:58"
            //         },
            //         {
            //             "survey_id": 2,
            //             "survey_title": "IT Department Evaluation 2024",
            //             "responded": 1,
            //             "period-end": "2024-11-18 23:00:00"
            //         },
            //         {
            //             "survey_id": 3,
            //             "survey_title": "CS Department Evaluation 2024",
            //             "responded": 0,
            //             "period-end": "2024-11-18 23:00:00"
            //         },
            //         {
            //             "survey_id": 5,  // Updated ID for example hidden survey
            //             "survey_title": "BMMA Department Evaluation 2024",
            //             "responded": 0,
            //             "period-end": "2024-12-18 23:00:00"
            //         }
            //     ]
            // };
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
            if (hiddenSurveys.includes(survey.survey_id)) surveyElement.classList.add('hidden-survey'); // If survey is hidden, add class

            // Format the end time in standard time format
            const periodEndDate = new Date(survey['period-end']);
            const formattedDate = !isNaN(periodEndDate.getTime())
                ? periodEndDate.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true
                })
                : 'Invalid Date';

            const currentDate = new Date();

            // Set different colors based on survey status and period end
            if (survey.responded) {
                surveyElement.classList.add('green');
            } else if (currentDate > periodEndDate) {
                surveyElement.classList.add('red'); // Missed
            } else if (currentDate < periodEndDate) {
                surveyElement.classList.add('yellow'); // Still valid
            }

            surveyElement.innerHTML = `
                <div>
                    <div class="survey-title">${survey.survey_title}</div>
                    <div class="survey-info">
                        ${survey.responded
                ? `Submission Closed: ${formattedDate}`
                : currentDate > periodEndDate
                    ? `Submission Closed: ${formattedDate}`
                    : `Valid Until: ${formattedDate}`}
                    </div>
                </div>
                <div class="survey-actions">
                    <button class="hide-button">${hiddenSurveys.includes(survey.survey_id) ? 'Unhide Survey' : 'Hide Survey'}</button>
                    <a href="/student/survey?id=${survey.survey_id}" class="action-link">
                        ${survey.responded == 1 ? 'Check Details 📄' : survey.responded == 0 && currentDate < periodEndDate ? 'Take Survey 📝' : 'Check Details 📄'}
                    </a>
                </div>
            `;

            // Handle anchor tag click to get data from db
            surveyElement.querySelector('a').addEventListener('click', (function (survey) {
                return function (event) {
                    event.preventDefault();
                    fetch(`/student/survey?id=${survey.survey_id}`)
                        .then(response => response.json())
                        .then(surveyData => {
                            sessionStorage.setItem('questionnaireData', JSON.stringify(surveyData));
                            window.location.href = '/student/survey/questionnaires';
                        })
                        .catch(error => console.error("Fetch error: ", error));
                };
            })(survey));

            // Hide/unhide button functionality
            surveyElement.querySelector('.hide-button').addEventListener('click', () => {
                if (hiddenSurveys.includes(survey.survey_id)) {
                    // Unhide survey
                    hiddenSurveys = hiddenSurveys.filter(id => id !== survey.survey_id);
                    sessionStorage.setItem('hiddenSurveys', JSON.stringify(hiddenSurveys)); // Save to sessionStorage
                    surveyElement.classList.remove('hidden-survey');
                    surveyElement.querySelector('.hide-button').textContent = 'Hide Survey';
                } else {
                    // Hide survey
                    hiddenSurveys.push(survey.survey_id);
                    sessionStorage.setItem('hiddenSurveys', JSON.stringify(hiddenSurveys)); // Save to sessionStorage
                    surveyElement.classList.add('hidden-survey');
                    surveyElement.querySelector('.hide-button').textContent = 'Unhide Survey';
                }
                filterSurveys(); // Reapply filters after hiding/unhiding
            });
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
            filteredSurveys = surveyData.filter(survey => !survey.responded && new Date() > new Date(survey['period-end']));
        } else if (filterType === 'hidden') {
            filteredSurveys = surveyData.filter(survey => hiddenSurveys.includes(survey.survey_id));
        }

        renderSurveys(filteredSurveys);
    }

    // Initial fetch
    fetchSurveys();
});

// Another way to logout
function logout() {
    fetch('http://localhost:8888/session/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ '_method': 'DELETE' })
    })
        .then(response => response.text())
        .then(data => {
            console.log("Logout response:", data);
        })
        .catch(error => console.error("Logout error:", error));
}
