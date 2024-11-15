// Listen for the Enter key on the search input
document.getElementById("search-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") { // When Enter is pressed
        const searchQuery = document.getElementById("search-input").value.toLowerCase();

        const surveyTemplates = document.querySelectorAll(".survey-template");
        const recentItems = document.querySelectorAll(".recent-item");

        let matchFound = false;

        surveyTemplates.forEach((survey) => {
            const title = survey.querySelector("p").textContent.toLowerCase();
            if (title.includes(searchQuery)) {
                survey.classList.remove("hidden");
                matchFound = true;
            } else {
                survey.classList.add("hidden");
            }
        });

        recentItems.forEach((item) => {
            const title = item.querySelector("p").textContent.toLowerCase();
            if (title.includes(searchQuery)) {
                item.classList.remove("hidden");
                matchFound = true;
            } else {
                item.classList.add("hidden");
            }
        });

        if (!matchFound) {
            alert("No matching surveys found!");
        }
    }
});

document.querySelector('.hide-link').addEventListener('click', function () {
    const completedSurveysContainer = document.querySelector('.recent-surveys');

    completedSurveysContainer.classList.toggle('hidden');

    if (completedSurveysContainer.classList.contains('hidden')) {
        this.textContent = 'Show';
    } else {
        this.textContent = 'Hide';
    }
});

// Toggle search input visibility when search icon is clicked
document.getElementById("search-icon").addEventListener("click", function () {
    const searchInput = document.getElementById("search-input");
    searchInput.classList.toggle("hidden"); // Toggle visibility of the search input field
});

function createSurveyElements(data, containerId, isOpenSurvey) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing elements

    data.forEach(survey => {
        const surveyElement = document.createElement('div');
        surveyElement.classList.add(isOpenSurvey ? 'survey-template' : 'recent-item');

        const surveyTitle = document.createElement('p');
        surveyTitle.textContent = survey.survey_title;
        surveyElement.appendChild(surveyTitle);

        // Create an anchor tag instead of a button
        const link = document.createElement('a');
        link.href = `/student/survey?id=${survey.survey_id}`; // Set the href attribute
        link.textContent = isOpenSurvey ? 'Take The Survey' : 'View Details';
        link.classList.add('survey-link'); // Optional: add a class for styling if needed

        // Attach click event to the anchor tag
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior

            // Fetch survey data (replace the URL with your actual endpoint)
            fetch(`/student/survey?id=${survey.survey_id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok. Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(surveyData => {
                    console.log('(anchor) Raw response:', surveyData);

                    if (!surveyData.survey_id) {
                        throw new Error('Missing survey_id in the API response.');
                    }

                    // Store the survey data in sessionStorage
                    sessionStorage.setItem('questionnaireData', JSON.stringify(surveyData));

                    // Redirect to the survey page
                    window.location.href = `http://localhost:8888/student/survey/questionnaire?id=${surveyData.survey_id}`; // NOTE: THIS IS TEMPORARY URI IF U FIND THIS NOTIFY ME DAGUL
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error.message);
                    console.error(error);
                });

        });

        surveyElement.appendChild(link);
        container.appendChild(surveyElement);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const storedSurveysData = sessionStorage.getItem('surveysData');
    if (storedSurveysData) {
        console.log("Using survey data from sessionStorage");

        // Parse the stored data and log it
        const parsedData = JSON.parse(storedSurveysData);
        console.log("Parsed Data: ", parsedData);  // Log the full parsed data

        // Check if parsedData is an array and has at least one survey object
        if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log("Survey data found:", parsedData);

            // Separate open surveys and completed surveys as needed
            const openSurveys = [];
            const completedSurveys = [];  // Add logic here if you later need to categorize surveys

            // Populate openSurveys array with all survey objects from parsedData
            parsedData.forEach(survey => {
                // Example logic: Add to openSurveys if survey_id exists
                if (survey.survey_id) {
                    openSurveys.push(survey);
                }
            });

            // Pass arrays to the createSurveyElements function
            createSurveyElements(openSurveys, 'open-surveys', true);  // Open Surveys
            createSurveyElements(completedSurveys, 'recent-surveys', false); // Completed Surveys (none in this case)
        } else {
            console.error('No valid survey data found in sessionStorage:', parsedData);
        }

        // Optionally, clear session storage if you don't need it anymore
        sessionStorage.removeItem('surveysData');
    } else {
        // Fetch surveys from the PHP server if no data is stored
        fetchSurveys();
        console.log("No Data in sessionStorage");
    }
});

  
async function fetchSurveys() {
try {
    const response = await fetch('http://localhost:8888/student/surveys');
    const jsonString = await response.text();

    console.log("Raw response:", jsonString);

    const parsedData = JSON.parse(jsonString);
    const openSurveysData = parsedData.surveys.filter(survey => !survey.isComplete);
    const completedSurveysData = parsedData.surveys.filter(survey => survey.isComplete);

    createSurveyElements(openSurveysData, 'open-surveys', true);
    createSurveyElements(completedSurveysData, 'recent-surveys', false);
} catch (error) {
    console.error('Error fetching surveys:', error);
}
}

  