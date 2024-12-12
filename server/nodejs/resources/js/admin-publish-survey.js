
document.addEventListener("DOMContentLoaded", async() => {
    const surveyData = JSON.parse(sessionStorage.getItem('surveyData'))

    // const programDropdownToggle = document.querySelector('.dropdown-toggle[onclick*="program-dropdown"]');
    // const studentDropdownToggle = document.querySelector('.dropdown-toggle[onclick*="student-dropdown"]');
    // const batchDropdownToggle = document.querySelector('.dropdown-toggle[onclick*="batch-dropdown"]');
    //
    // if (programDropdownToggle) {
    //     programDropdownToggle.addEventListener('click', () => toggleRestrictionsDropdown('program-dropdown'));
    // }
    // if (studentDropdownToggle) {
    //     studentDropdownToggle.addEventListener('click', () => toggleRestrictionsDropdown('student-dropdown'));
    // }
    // if (batchDropdownToggle) {
    //     batchDropdownToggle.addEventListener('click', () => toggleRestrictionsDropdown('batch-dropdown'));
    // }

    const surveyTitleElement = document.getElementById('survey-title');
    const surveyDescriptionElement = document.getElementById('survey-description');

    if (surveyTitleElement && surveyDescriptionElement) {
        surveyTitleElement.textContent = surveyData.surveyReq.survey_title;
        surveyDescriptionElement.textContent = surveyData.surveyReq.survey_description;
    }

    fetchAllUsers().then(data => {
        addStudentsDropdown(data,"student-dropdown"); // Add options for responders
    })

    fetchFromServer().then(data => {
        addOptions(data.availability, "program-dropdown"); // Add options for programs
        // addOptions({["BSCS 3-1", "BSIT 2-2", "BSBA 1-1"]}, "batch-dropdown"); // Add options for batches
    });

    const publishButton = document.getElementById("publishButton"); // Second button for 'Publish'
    if (publishButton) {

        publishButton.addEventListener("click", async () => {

            const programFilters = getSelectedValues("program-dropdown");
            const studentFilters = getSelectedValues("student-dropdown");

            var filters = {
                "filters": [
                    {
                        "not":
                            {
                                "username": studentFilters //this is the not allowed users
                            }
                    },
                    {
                        "equal":
                            {
                                "program_id": programFilters //this is the allowed programs
                            }
                    }

                ]
            }

            console.log(JSON.stringify(filters))

            var result = await fetchAllowedUsers(filters)
            var userArray = []
            for(item in result){
                console.log(item)
                let jsonObject = {}
                jsonObject.username = result[item].username
                userArray.push(jsonObject)
            }

            console.log(userArray)

            const fromDate = document.querySelector('input[type="date"]').value;
            const startTime = document.querySelector('input[type="time"]').value;
            const untilDate = document.querySelectorAll('input[type="date"]')[1].value;
            const endTime = document.querySelectorAll('input[type="time"]')[1].value;
            surveyData.surveyReq.period_start = `${fromDate} ${startTime}`;
            surveyData.surveyReq.period_end = `${untilDate} ${endTime}`;
            surveyData.users = userArray

            // Prepare and print the JSON data that will be sent to the server
            console.log(`Survey Data to send: ${JSON.stringify(surveyData)}`);

            // Step 4: Publish button logic to send data (commented for now)
            fetch('http://localhost:2020/api/survey-service/survey', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(surveyData)
            })
                .then(response => response.json())
                .then(data => console.log('Success:', data))
                .catch(error => console.error('Error:', error));

            // Redirect to survey creation page
            sessionStorage.clear()
            window.location.href = "/admin/create";
        });
    } else {
        console.error("Publish button not found.");
    }
});


function toggleRestrictionsDropdown(containerId) {
    const dropdown = document.getElementById(containerId);
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
}

async function fetchAllowedUsers(filters) {
    const url = "http://localhost:2020/api/user-service/users/filtered";

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filters)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched allowed users:", data);

        console.log(data)
        return data;
    } catch (error) {
        console.error("Error fetching allowed users:", error);
    }
}

async function fetchAllUsers(){
    const url = "http://localhost:2020/api/user-service/users";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error.message);
        return null;
    }
}

async function fetchFromServer() {
    const url = "http://localhost:2020/api/program-service/programs"
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error.message);
        return null;
    }
}

function addStudentsDropdown(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    data.users.forEach(user => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = user.username; // Use username as the value
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${user.given_name} ${user.last_name}`));
        container.appendChild(label);
    });
}

function addOptions(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    data.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item.program_id;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(JSON.stringify(item.program_name)));
        container.appendChild(label);
    });
}

function getSelectedValues(containerId) {
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}