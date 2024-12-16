document.addEventListener("DOMContentLoaded", async () => {
    const surveyData = JSON.parse(sessionStorage.getItem('surveyData2'));
    // console.log("Ito and tunay na survey data: ",surveyData);
    console.dir(surveyData, {depth: null});

    const surveyTitleElement = document.getElementById('survey-title');
    const surveyDescriptionElement = document.getElementById('survey-description');

    if (surveyTitleElement && surveyDescriptionElement) {
        surveyTitleElement.textContent = surveyData.survey.survey_title;
        surveyDescriptionElement.textContent = surveyData.survey.survey_description;
    }

    // Fetch data for dropdowns
    await fetchAllUsers().then(data => {
        addStudentsDropdown(data, "student-dropdown"); // Add options for responders
    });

    await fetchFromServer().then(data => {
        addOptions(data.availability, "program-dropdown"); // Add options for programs
    });

    await importExcludedUsers(surveyData.survey.survey_id);

    const programIDS = surveyData.survey.program_id.program_id;
    console.log("Program IDS: ",programIDS);
    importAllowedPrograms(programIDS);
    await importDateAndTime(surveyData.survey);

    // Instant validation for date and time inputs
    const fromDateInput = document.querySelector('input[type="date"]');
    const startTimeInput = document.querySelector('input[type="time"]');
    const untilDateInput = document.querySelectorAll('input[type="date"]')[1];
    const endTimeInput = document.querySelectorAll('input[type="time"]')[1];

    function validateDateTime() {
        const currentDate = new Date().toISOString().split("T")[0];
        const startDate = fromDateInput.value;
        const endDate = untilDateInput.value;

        if (startDate && startDate < currentDate) {
            alert("The start date cannot be earlier than the current date.");
            fromDateInput.value = "";
            startTimeInput.value = "";
        } else if (startDate && endDate && startDate > endDate) {
            alert("The start date cannot be later than the end date.");
            if (document.activeElement === fromDateInput) {
                fromDateInput.value = "";
                startTimeInput.value = "";
            }
        } else if (startDate && endDate && endDate < startDate) {
            alert("The end date cannot be earlier than the start date.");
            if (document.activeElement === untilDateInput) {
                untilDateInput.value = "";
                endTimeInput.value = "";
            }
        }
    }

    fromDateInput.addEventListener("change", validateDateTime);
    startTimeInput.addEventListener("change", validateDateTime);
    untilDateInput.addEventListener("change", validateDateTime);
    endTimeInput.addEventListener("change", validateDateTime);

    // Publish button logic
    const publishButton = document.getElementById("publishButton");
    if (publishButton) {
        publishButton.addEventListener("click", async () => {
            // Check if at least one program is selected
            const selectedPrograms = getSelectedValues("program-dropdown");
            if (selectedPrograms.length === 0) {
                alert("Please select at least one program before publishing the survey.");
                return; // Exit the function if no program is selected
            }

            // Proceed with publishing the survey if a program is selected
            await publishSurvey(surveyData).then(r => console.log("Survey published:", r));
            window.location.href = 'http://localhost:2021/admin/surveys';
        });
    } else {
        console.error("Publish button not found.");
    }
});




// Survey Publishing Functions
async function publishSurvey(currentData) {
    const filters = filtersAPI();
    console.log(JSON.stringify(filters));

    const result = await fetchAllowedUsers(filters);
    const userArray = result.map(item => ({
        username: item.username
    }));

    console.log(userArray);
    const fromDate = document.querySelector('input[type="date"]').value;
    const startTime = document.querySelector('input[type="time"]').value;
    const untilDate = document.querySelectorAll('input[type="date"]')[1].value;
    const endTime = document.querySelectorAll('input[type="time"]')[1].value;

    currentData.survey.period_start = `${fromDate} ${startTime}:00`;
    currentData.survey.period_end = `${untilDate} ${endTime}:00`;
    currentData.survey.users = userArray;

    const updateSurveyJSON = {
        "survey_id": currentData.survey.survey_id,
        "survey_title": currentData.survey.survey_title,
        "survey_description": currentData.survey.survey_description,
        "program_id": filters.filters[1].equal.program_id,
        // "program_id": {
        //     "program_id": filters.filters[1].equal.program_id
        // },
        "period_start": currentData.survey.period_start,
        "period_end": currentData.survey.period_end,
        "responders": await fetchAllowedUsers(filters)
    }


    console.log("TANGINA TALGAG PAG ITO MALI",JSON.stringify(updateSurveyJSON))

    const oldSurveyData = JSON.parse(sessionStorage.getItem('oldSurveyData'));
    surveyDifferences(oldSurveyData, currentData);
    await updateSurvey (updateSurveyJSON,filters)
    console.log("Survey Data to send:", JSON.stringify(updateSurveyJSON));
}

function filtersAPI() {
    const programFilters = getSelectedValues("program-dropdown");
    const studentFilters = getSelectedValues("student-dropdown");

    const filters = {
        "filters": [
            {
                "not": {
                    "username": studentFilters // this is the not allowed users
                }
            },
            {
                "equal": {
                    "program_id": programFilters // this is the allowed programs
                }
            }
        ]
    };

    console.log("Filters API: "+JSON.stringify(filters));
    return filters;
}

// Fetching Functions
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
        console.log("Fetched allowed users:", JSON.stringify(data));
        return data;

    } catch (error) {
        console.error("Error fetching allowed users:", error);
    }
}

async function fetchAllUsers() {
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
    const url = "http://localhost:2020/api/program-service/programs";

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

// Dropdown and UI Functions
function addStudentsDropdown(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    data.users.forEach(user => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = user.username;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${user.given_name} ${user.last_name}`));
        container.appendChild(label);
    });
}

// function addSemester(containerId) {
//     const container = document.getElementById(containerId);
//     container.innerHTML = ''; // Clear existing options
//
//     const sems = [
//         { semester: "first" },
//         { semester: "second" }
//     ];
//
//     sems.forEach(item => {
//         const label = document.createElement('label');
//         const checkbox = document.createElement('input');
//         checkbox.type = 'checkbox';
//         checkbox.value = item.semester;
//         label.appendChild(checkbox);
//         label.appendChild(document.createTextNode(item.semester));
//         container.appendChild(label);
//     });
// }

// function addYear(containerId, startYear) {
//     const container = document.getElementById(containerId);
//     container.innerHTML = '';
//
//     const now = new Date();
//     const currentYear = now.getFullYear();
//
//     // Create an array of all the years from the start year to the current year + 100
//     const allYears = [];
//     for (let year = startYear; year <= currentYear + 100; year++) {
//         allYears.push(year);
//     }
//
//     for (const year of allYears) {
//         const label = document.createElement('label');
//         const checkbox = document.createElement('input');
//         checkbox.type = 'checkbox';
//         checkbox.value = year;
//         checkbox.checked = year === currentYear; // Set the current year as checked by default
//         label.appendChild(checkbox);
//         label.appendChild(document.createTextNode(year));
//         container.appendChild(label);
//     }
//
//     const dropdown = container.closest('.dropdown-checkbox'); // Find the closest dropdown container
//     console.log(dropdown)
//     const dropdownOptions = dropdown.querySelector('.dropdown-checkbox-options');
//
//     dropdown.addEventListener('click', () => {
//         console.log("hit")
//         const currentYearCheckbox = container.querySelector(`input[value="${currentYear}"]`);
//         if (currentYearCheckbox && dropdownOptions) {
//             dropdownOptions.scrollTop = currentYearCheckbox.offsetTop - dropdownOptions.offsetTop;
//         }
//     });
// }

function toggleDropdown(containerId) {
    const dropdown = document.getElementById(containerId);
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
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

function getSelectedValue(containerId) {
    const container = document.getElementById(containerId);
    const checkedCheckbox = container.querySelector('input[type="checkbox"]:checked');
    return checkedCheckbox ? parseInt(checkedCheckbox.value, 10) : null;
}

async function importDateAndTime(surveyData) {
    const startTimeAndDate = removeLetters(surveyData.period_start);
    const endTimeAndDate = removeLetters(surveyData.period_end);

    const [startDate, startTimeWithSeconds] = startTimeAndDate.split('T');
    const [endDate, endTimeWithSeconds] = endTimeAndDate.split('T');
    const startTime = startTimeWithSeconds.split(':').slice(0, 2).join(':');
    const endTime = endTimeWithSeconds.split(':').slice(0, 2).join(':');

    console.log(`Start date: ${startDate}, start time: ${startTime}`);
    console.log(`End date: ${endDate}, end time: ${endTime}`);

    const fromDate = document.getElementById("from-date");
    fromDate.value = startDate;

    const fromTime = document.getElementById("start-time");
    fromTime.value = startTime;

    const untilDate = document.getElementById("until-date");
    untilDate.value = endDate;

    const untilTime = document.getElementById("until-time");
    untilTime.value = endTime;
}

function removeLetters(string) {
    return string.replace('Z', ' '); // Removes 'Z', replaces with space for clarity
}

async function fetchRespondentsForEdit(surveyId) {
    console.log("Trying to fetch respondents");
    const url = 'http://localhost:2020/api/survey-service/respondents';
    const data = { survey_id: surveyId };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Ensure the result is an array
        if (!Array.isArray(result)) {
            console.error("Unexpected response format:", result);
            return [];
        }

        console.log("Respondents result:", result);
        return result;
    } catch (error) {
        console.error(`Error for survey_id ${surveyId}:`, error);
        return [];
    }
}

async function fetchExcludedUsers(surveyID) {
    console.log("Fetching excluded users...");
    try {
        // Fetch respondents
        const respondents = await fetchRespondentsForEdit(surveyID);

        // Ensure respondents is an array
        if (!Array.isArray(respondents)) {
            console.error("Error: Respondents is not an array", respondents);
            throw new Error("Respondents must be an array");
        }

        // Map usernames from respondents
        const respondentUsernames = respondents.map(respondent => {
            if (typeof respondent.username === "undefined") {
                console.error("Error: Respondent object missing 'username'", respondent);
                throw new Error("Respondent object missing 'username'");
            }
            return respondent.username;
        });

        // Construct filters
        const filters = {
            "filters": [
                { "not": {"username": respondentUsernames } },
                { "equal": {} }
            ]
        };

        // Fetch allowed users
        const allowedUsers = await fetchAllowedUsers(filters);

        // Ensure allowedUsers is an array
        if (!Array.isArray(allowedUsers)) {
            console.error("Invalid response from fetchAllowedUsers:", allowedUsers);
            throw new Error("fetchAllowedUsers did not return an array");
        }

        // Extract allowed usernames from the allowedUsers array
        const allowedUsernames = allowedUsers.map(user => user.username);

        // Filter respondents to get those who are not in allowedUsers
        const excludedUsers = respondents.filter(respondent => !allowedUsernames.includes(respondent.username));

        console.log("Excluded users:", excludedUsers);

        return allowedUsers; // Return the list of excluded users
    } catch (error) {
        console.error("Error fetching excluded users:", error);
        return []; // Return an empty array in case of error
    }
}


async function importExcludedUsers(surveyID) {
    const container = document.getElementById('student-dropdown');
    if (!container) {
        console.error("Error: #student-dropdown element not found.");
        return;
    }

    const users = await fetchExcludedUsers(surveyID);
    // console.log(`Users to import: ${JSON.stringify(users)}`);

    for (const user of users) {
        // console.log(`Importing user: ${user.username}`);
        const checkbox = container.querySelector(`input[type="checkbox"][value="${user.username}"]`);
        // console.log(`Checkbox: ${checkbox}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    }
}

function importAllowedPrograms(programs) {
    console.log(`Programs to import: ${programs}`)
    const container = document.getElementById('program-dropdown');
    console.log(`Container: ${container}`)
    for (const id of programs) {
        console.log(`Importing program ID ${id}`)
        // Select the checkbox with a matching value attribute
        const checkbox = container.querySelector(`input[type="checkbox"][value="${id}"]`);
        console.log(`Checkbox: ${checkbox}`)
        if (checkbox) {
            // Set the checkbox as checked
            checkbox.checked = true;
        }
    }
}


function getSelectedValues(containerId) {
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function toggleRestrictionsDropdown(containerId) {
    const dropdown = document.getElementById(containerId);
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
}

// Survey Modifications and Differences
function surveyDifferences(oldSurveyData, surveyData) {
    // console.log("Checking for differences in survey data...");
    // console.log("Old survey data:", oldSurveyData);
    const surveyID = surveyData.survey.survey_id;
    console.log("Survey ID:", surveyID);

    const oldQuestions = new Map(oldSurveyData.questions.map(q => [q.question_id, q]));
    const newQuestions = new Map(surveyData.questions.map(q => [q.question_id, q]));
    console.log("Old questions:", oldQuestions);
    console.log("New questions:", newQuestions);


    deleteQuestion(newQuestions, oldQuestions);
    updateQuestion(newQuestions, oldQuestions, surveyID);

}

function updateQuestion(newQuestions, oldQuestions, surveyID) {
    newQuestions.forEach((newQuestion, questionID) => {
        if (!newQuestion.question_id) {
            console.log(`Adding new question`);
            addQuestion(surveyID, newQuestion.question_json, newQuestion.question_type)
                .then(r => console.log("Question added:", r));
        } else {
            const oldQuestion = oldQuestions.get(questionID);
            if (JSON.stringify(oldQuestion) !== JSON.stringify(newQuestion)) {
                console.log(`Updating question ID ${questionID}`);
                updateQuestionAPI(questionID, surveyID, newQuestion.question_json, newQuestion.question_type)
                    .then(r => console.log("Question updated:", r));
            } else {
                console.log(`No changes for question ID ${questionID}`);
            }
        }
    });
}

function deleteQuestion(newQuestions, oldQuestions) {
    oldQuestions.forEach((oldQuestion, questionID) => {
        if (!newQuestions.has(questionID)) {
            console.log(`Deleting question ID ${questionID}`);
            deleteQuestionAPI(questionID).then(r => console.log("Question deleted:", r));
        }
    });
}
//Survey API
async function updateSurvey(surveyData, filteredData) {
    const url = "http://localhost:2020/api/survey-service/survey"
    // console.log("Error to sige!!!!!:", surveyData);
    // console.log("Error to hinde:", surveyData.survey_id);
    // console.log("Eto yung program ID kase:", JSON.stringify(surveyData.program_id));

    try {

        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "survey_id": surveyData.survey_id,
                "survey_title": surveyData.survey_title,
                "survey_description": surveyData.survey_description,
                "program_id": surveyData.program_id.map((id) => parseInt(id)),
                // "program_id": {
                //
                // },
                "period_start": surveyData.period_start,
                "period_end": surveyData.period_end,
                "responders": await fetchAllowedUsers(filteredData)
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to update survey. Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Survey updated:", result);
    } catch (error) {
        console.error("Error updating survey:", error);
    }
}

// Question APIs
async function updateQuestionAPI(question_id, survey_id, question_json, question_type) {
    console.log("Updating question:", question_id, survey_id, question_json, question_type);
    const url = "http://localhost:2020/api/survey-service/questions";

    try {
        if (question_type === 'rating' && Array.isArray(question_json.scale)) {
            question_json.scale = question_json.scale.length;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                surveyID: survey_id,
                questionJSON: JSON.stringify(question_json),
                questionType: question_type,
                operation: "modify",
                questionID: question_id
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to update question. Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Question updated:", result);
    } catch (error) {
        console.error("Error updating question:", error);
    }
}

async function deleteQuestionAPI(question_id) {
    const url = "http://localhost:2020/api/survey-service/questions";

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: "remove",
                questionID: question_id
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to delete question. Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Question deleted:", result);
    } catch (error) {
        console.error("Error deleting question:", error);
    }
}

async function addQuestion(survey_id, question_json, question_type) {
    const url = "http://localhost:2020/api/survey-service/questions";

    try {
        console.log('Adding question:', survey_id, question_json, question_type);

        if (question_type === 'rating' && Array.isArray(question_json.scale)) {
            question_json.scale = question_json.scale.length;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                surveyID: survey_id,
                questionJSON: JSON.stringify(question_json),
                questionType: question_type,
                operation: "add"
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to add question. Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Question added:", result);
    } catch (error) {
        console.error("Error adding question:", error);
    }
}