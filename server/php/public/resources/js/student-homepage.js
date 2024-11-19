document.addEventListener('DOMContentLoaded', function () {
    let surveyData = [];

    // Fetch surveys data from the server
    async function fetchSurveys() {
        try {
            const jsonString = {
                "surveys": [
                    {
                        "survey-id": 1,
                        "survey-title": "marven",
                        "responded": false,
                        "period-start": "2024-09-25",
                        "period-end": "2024-09-26"
                    },
                    {
                        "survey-id": 2,
                        "survey-title": "sample-title",
                        "responded": true,
                        "period-start": "2024-09-27",
                        "period-end": "2024-09-29"
                    }
                ]
            }

            // const response = await fetch('http://localhost:8888/student/surveys');
            // const jsonString = await response.text();
            // const parsedData = JSON.parse(jsonString);
            surveyData = jsonString.surveys;
            renderSurveys(surveyData);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        }
    }

    // Render surveys on the page
    function renderSurveys(data) {
        const surveyList = document.getElementById('survey-list');
        surveyList.innerHTML = ''; // Clear the list

        data.forEach(survey => {
            const surveyElement = document.createElement('div');
            surveyElement.classList.add('survey-item');

            // Set different colors based on survey status
            if (survey.responded) {
                surveyElement.classList.add('green');
            } else if (new Date() > new Date(survey['period-end'])) {
                surveyElement.classList.add('red');
            } else {
                surveyElement.classList.add('yellow');
            }

            surveyElement.innerHTML = `
                <div>
                    <div class="survey-title">${survey['survey-title']}</div>
                    <div class="survey-info">
                        ${survey.responded ? `Time Submitted: ${survey['period-end']}` : `Valid Until: ${survey['period-end']}`}
                    </div>
                </div>
                <div class="survey-actions">
                    <button class="hide-button">Hide Survey</button>
                    <a href="/student/survey?id=${survey['survey-id']}" class="action-link">
                        ${survey.responded ? 'Check Details 📄' : 'Take The Survey ✎'}
                    </a>
                </div>
            `;

            // Handle anchor tag click to get data from db
            surveyElement.querySelector('a').addEventListener('click', function(event) {
                event.preventDefault();
                fetch(`/student/survey?id=${survey['survey-id']}`)
                    .then(response => response.json())
                    .then(surveyData => {
                        sessionStorage.setItem('questionaireData', JSON.stringify(surveyData));
                        window.location.href = `/student/survey/questionaire?id=${surveyData.question_id}`;
                    })
                    .catch(error => console.error("Fetch error: ", error));
            });

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
