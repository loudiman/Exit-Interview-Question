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
        surveyTitleElement.textContent = surveyData.surveyReq.survey_title;
        surveyDescriptionElement.textContent = surveyData.surveyReq.survey_description;
    }

    // Step 2: Fetch the data from the server
    fetchFromServer().then(data => {
        addOptions(data.availability, "program-dropdown"); // Add options for programs
        addOptions(data.responders, "student-dropdown"); // Add options for responders
    });

    addYear("year-dropdown", 1911); // Add options for year
    addSemester("semester-dropdown"); // Add options for semester

    const publishButton = document.querySelector(".publish-button"); // Second button for 'Publish'
    if (publishButton) {
        publishButton.addEventListener("click", () => {
            surveyData.surveyReq.program_id = getSelectedValues("program-dropdown");
            surveyData.restrict_students = getSelectedValues("student-dropdown");

            // Get date and time values
            const fromDate = document.querySelector('input[type="date"]').value;
            const startTime = document.querySelector('input[type="time"]').value;
            const untilDate = document.querySelectorAll('input[type="date"]')[1].value;
            const endTime = document.querySelectorAll('input[type="time"]')[1].value;
            surveyData.surveyReq.period_start = `${fromDate}T${startTime}`;
            surveyData.surveyReq.period_end = `${untilDate}T${endTime}`;

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

async function fetchFromServer() {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error.message);
        return null;
    }
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

function addSemester(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing options

    const sems = [
        { semester: "first" },
        { semester: "second" }
    ];

    sems.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item.semester;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(item.semester));
        container.appendChild(label);
    });
}

function addYear(containerId, startYear) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const now = new Date();
    const currentYear = now.getFullYear();

    // Create an array of all the years from the start year to the current year + 100
    const allYears = [];
    for (let year = startYear; year <= currentYear + 100; year++) {
        allYears.push(year);
    }

    for (const year of allYears) {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = year;
        checkbox.checked = year === currentYear; // Set the current year as checked by default
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(year));
        container.appendChild(label);
    }

    const dropdown = container.closest('.dropdown-checkbox'); // Find the closest dropdown container
    const dropdownOptions = dropdown.querySelector('.dropdown-checkbox-options');

    dropdown.addEventListener('click', () => {
        const currentYearCheckbox = container.querySelector(`input[value="${currentYear}"]`);
        if (currentYearCheckbox && dropdownOptions) {
            dropdownOptions.scrollTop = currentYearCheckbox.offsetTop - dropdownOptions.offsetTop;
        }
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