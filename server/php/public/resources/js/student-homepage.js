document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        console.log('Logout button found');
        // logoutBtn.addEventListener('click', logout);
    }

    let surveyData = [];

    // Fetch surveys data from the server
    async function fetchSurveys() {
        try {
            // const jsonString = {
            //     "surveys": [
            //       {
            //         "survey_id": 4,
            //         "survey_title": "Test1",
            //         "responded": 1,
            //         "period-start":"2024-11-16 15:24:58",
            //         "period-end":"2024-11-17 18:24:58"
            //       },
            //       {
            //         "survey_id": 2,
            //         "survey_title":"IT Department Evaluation 2024",
            //         "responded":1,
            //         "period-start":"2024-11-17 08:00:00",
            //         "period-end":"2024-11-18 23:00:00"
            //       }
            //     ]
            // };

            const response = await fetch('http://localhost:8888/student');
            const jsonString = await response.json(); // response is already a JSON object not plain text
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

            // Set different colors based on survey status
            if (survey.responded) {
                surveyElement.classList.add('green');
            } 
            
            if (survey.responded == 0) {
                if (new Date() < new Date(survey.period_end)) {
                    surveyElement.classList.add('yellow');
                } else if (new Date() > new Date(survey.period_end)) {
                    surveyElement.classList.add('red');
                }
            }

            surveyElement.innerHTML = `
                <div>
                    <div class="survey-title">${survey.survey_title}</div>
                    <div class="survey-info">
                        ${survey.responded ? `Time Submitted: ${survey.period_end}` : `Valid Until: ${survey.period_end}`}
                    </div>
                </div>
                <div class="survey-actions">
                    <button class="hide-button">Hide Survey</button>
                    <a href="/student/survey?id=${survey.survey_id}" class="action-link">
                        ${survey.responded == 1 ? 'Check Details 📄' : survey.responded == 0 && new Date() < new Date(survey.period_end) ? 'Take Survey 📝' : 'Check Details 📄'}
                    </a>
                </div>
            `;

            // Handle anchor tag click to get data from db
            surveyElement.querySelector('a').addEventListener('click', (function(survey) {
                return function(event) {
                    event.preventDefault();
                    fetch(`/student/survey?id=${survey.survey_id}`)
                        .then(response => response.json())
                        .then(surveyData => {
                            sessionStorage.setItem('questionnaireData', JSON.stringify(surveyData));
                            // window.location.href = `/student/survey/questionaire?id=${surveyData.question_id}`;
                            window.location.href = '/student/survey/questionnaires';
                        })
                        .catch(error => console.error("Fetch error: ", error));
                };
            })(survey)
                // function(event) {
                // event.preventDefault();
                // fetch(`/student/survey?id=${survey.survey_id}`)
                //     .then(response => response.json())
                //     .then(surveyData => {
                //         sessionStorage.setItem('questionaireData', JSON.stringify(surveyData));
                //         // window.location.href = `/student/survey/questionaire?id=${surveyData.question_id}`;
                //         window.location.href = '/student/survey/questionnaires';
                //     })
                //     .catch(error => console.error("Fetch error: ", error));}
            );

            // Hide button functionality
            surveyElement.querySelector('.hide-button').addEventListener('click', () => {
                surveyElement.classList.add('hidden-survey');  // Subject for change
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
                survey['survey-title'].toLowerCase().includes(searchQuery)
            );
            renderSurveys(filteredSurveys);
        }
    });

    document.getElementById('survey-filter').addEventListener('change', (event) => {
        const filterType = event.target.value;
        let filteredSurveys = surveyData;
        if (filterType === 'completed') {
            filteredSurveys = surveyData.filter(survey => survey.responded);
        } else if (filterType === 'missed') {
            filteredSurveys = surveyData.filter(survey => !survey.responded && new Date() > new Date(survey['period-end']));
        } else if (filterType === 'hidden') {
            filteredSurveys = []; // subject for change
        }
        renderSurveys(filteredSurveys);
    });

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
            // window.location.href = 'http://localhost:8888/';
        })
        .catch(error => console.error("Logout error:", error));
}