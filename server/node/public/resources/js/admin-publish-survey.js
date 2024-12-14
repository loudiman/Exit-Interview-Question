document.addEventListener("DOMContentLoaded", () => {
    const surveyData = {
        survey: {
            availability: [
                "Bachelor of Science in Accountancy",
                "Bachelor of Science in Information Technology",
                "Bachelor of Science in Computer Science",
                "Bachelor of Multimedia Arts",
                "Bachelor of Science in Psychology",
                "Bachelor of Science in Business Administration",
                "Bachelor of Science in Civil Engineering",
                "Bachelor of Science in Nursing",
                "Bachelor of Arts in Communication",
                "Bachelor of Science in Mechanical Engineering",
                "Bachelor of Science in Mathematics",
                "Bachelor of Science in Biology"
            ],
            users: [
                "Lou Diamond Morados",
                "Jane Doe",
                "John Smith",
                "Gago",
                "Emily Clark",
                "Michael Brown",
                "Sarah Johnson",
                "David Wilson",
                "Jessica Miller",
                "Daniel Garcia",
                "Sophia Martinez",
                "James Anderson"
            ]
        }
    };

    // Populate dropdowns with checkboxes
    addOptions(surveyData.survey.availability, "program-dropdown");
    addOptions(surveyData.survey.users, "student-dropdown");
    addOptions(["BSCS 3-1", "BSIT 2-2", "BSBA 1-1"], "batch-dropdown");
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

// Example of how to use getSelectedValues
const selectedPrograms = getSelectedValues("program-dropdown");
console.log("Selected programs:", selectedPrograms);
