document.addEventListener("DOMContentLoaded", () => {
    // Step 1: Initialize JSON String from sessionStorage or default structured object
    let surveyData = JSON.parse(sessionStorage.getItem("surveyData")) || {
        survey: {
            survey_title: "Sample Title",
            survey_description: "Form Description",
            program_id: [],
            period_start: "",
            period_end: "",
            status: ""
        },
        questions: [
            {
                question_json: {
                    question: "",
                    options: [], // Used for question types like "multiple-choice" and "checkbox"
                    scale: [] // Used for "rating" questions
                },
                question_type: "rating" // Supports "rating", "multiple-choice", "checkbox", or "essay"
            }
        ],
        restrict_students: [] // List of restricted student names
    };

    // Update the survey title and description in the HTML
    const surveyTitleElement = document.querySelector('.survey-header-container h1');
    const surveyDescriptionElement = document.querySelector('.survey-header-container p');

    if (surveyTitleElement && surveyDescriptionElement) {
        surveyTitleElement.textContent = surveyData.survey.survey_title;
        surveyDescriptionElement.textContent = surveyData.survey.survey_description;
    }

    // Step 2: Fetch the data from the server
    fetch('/api/fetch-data')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch data');
            return response.json();
        })
        .then(data => {
            addOptions(data.availability, "program-dropdown");
            addOptions(data.responders, "student-dropdown");
            addOptions(["BSCS 3-1", "BSIT 2-2", "BSBA 1-1"], "batch-dropdown");
        })
        .catch(error => console.error('Error fetching data:', error));

    const publishButton = document.querySelectorAll(".publish-button")[1]; // Second button for 'Publish'
    if (publishButton) {
        publishButton.addEventListener("click", () => {
            // Get selected values from checkboxes
            surveyData.survey.program_id = getSelectedValues("program-dropdown");
            surveyData.restrict_students = getSelectedValues("student-dropdown");

            // Get date and time values
            const fromDate = document.querySelector('input[type="date"]').value;
            const startTime = document.querySelector('input[type="time"]').value;
            const untilDate = document.querySelectorAll('input[type="date"]')[1].value;
            const endTime = document.querySelectorAll('input[type="time"]')[1].value;
            surveyData.survey.period_start = `${fromDate}T${startTime}`;
            surveyData.survey.period_end = `${untilDate}T${endTime}`;

            // Send survey data to the server
            fetch('/api/publish-survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(surveyData)
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to publish survey');
                    return response.json();
                })
                .then(data => {
                    console.log('Survey published successfully:', data);
                    // Redirect to survey creation page
                    window.location.href = 'survey_templates.html';
                })
                .catch(error => {
                    console.error('Error publishing survey:', error);
                    alert('Failed to publish survey. Please try again.');
                });
        });
    } else {
        console.error("Publish button not found.");
    }
});

function addOptions(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing options
    data.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(item));
        container.appendChild(label);
    });
}

function getSelectedValues(containerId) {
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}