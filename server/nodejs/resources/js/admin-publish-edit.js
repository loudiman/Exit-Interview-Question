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
    fetchFromServer().then(data => {
        addOptions(data.availability, "program-dropdown"); // Add options for programs
        addOptions(data.responders, "student-dropdown"); // Add options for responders
        addOptions(["BSCS 3-1", "BSIT 2-2", "BSBA 1-1"], "batch-dropdown"); // Add options for batches
    });

    const publishButton = document.querySelector(".publish-button"); // Second button for 'Publish'
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

            // Prepare and print the JSON data that will be sent to the server
            console.log(`Survey Data to send: ${JSON.stringify(surveyData)}`);

            // Step 4: Publish button logic to send data (commented for now)
            /*
            fetch('/api/publish-survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(surveyData)
            })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
            */

            // Redirect to survey creation page
            window.location.href = 'survey_templates.html';
        });
    } else {
        console.error("Publish button not found.");
    }
});

function fetchFromServer() {
    // Simulate fetching data from the server
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                availability: [
                    "Bachelor of Science in Accountancy",
                    "Bachelor of Science in Information Technology",
                    "Bachelor of Science in Computer Science",
                    "Bachelor of Multimedia Arts"
                ],
                responders: [
                    "Lou Diamond Morados",
                    "Jane Doe",
                    "John Smith"
                ]
            });
        }, 1000);
    });
}

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

function toggleDropdown(containerId) {
    const dropdown = document.getElementById(containerId);
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
}

function getSelectedValues(containerId) {
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}