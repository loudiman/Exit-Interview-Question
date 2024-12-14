document.addEventListener("DOMContentLoaded", async () => {
    const surveyData = JSON.parse(sessionStorage.getItem('surveyData'));
    console.log(surveyData);
    console.dir(surveyData, { depth: null });

    const surveyTitleElement = document.getElementById('survey-title');
    const surveyDescriptionElement = document.getElementById('survey-description');

    if (surveyTitleElement && surveyDescriptionElement) {
        surveyTitleElement.textContent = surveyData.survey.survey_title;
        surveyDescriptionElement.textContent = surveyData.survey.survey_description;
    }

    fetchAllUsers().then(data => {
        addStudentsDropdown(data, "student-dropdown"); // Add options for responders
    });

    fetchFromServer().then(data => {
        addOptions(data.availability, "program-dropdown"); // Add options for programs
    });

    const publishButton = document.getElementById("publishButton");
    if (publishButton) {
        publishButton.addEventListener("click", async () => {
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
    console.log (fromDate);
    console.log (startTime);
    console.log (untilDate);
    console.log (endTime);
    
    currentData.survey.period_start = `${fromDate} ${startTime}:00`;
    currentData.survey.period_end = `${untilDate} ${endTime}:00`;
    currentData.survey.users = userArray;

    console.log("JSON TANGINA MO: ", JSON.stringify(currentData.json))
    console.log("Survey Title:", currentData.survey.survey_title);
    console.log("Survey Description:", currentData.survey.survey_description);
    console.log("Survey ID: ",currentData.survey.survey_id)
    console.log ("Period start: ",currentData.survey.period_start)
    console.log ("Period end:", currentData.survey.period_end)
    console.log(" Programs that are selected: " , filters.filters[1].equal.program_id)
    console.log("Pwede na users: ", filters.filters[0].not.username)



    const updateSurveyJSON = {
        "survey_id": currentData.survey.survey_id,
        "survey_title": currentData.survey.survey_title,
        "survey_description": currentData.survey_description,
        "program_id": 1,
        "period_start": currentData.survey.period_start,
        "period_end": currentData.survey.period_end
    }


    console.log("TANGINA TALGAG PAG ITO MALI",JSON.stringify(updateSurveyJSON))

    const oldSurveyData = JSON.parse(sessionStorage.getItem('oldSurveyData'));
    surveyDifferences(oldSurveyData, currentData);
    updateSurvey (currentData,filters)
    console.log("Survey Data to send:", JSON.stringify(currentData));
}

function filtersAPI() {
    const programFilters = getSelectedValue("program-dropdown");
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

    console.log(JSON.stringify(filters));
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
        console.log("Fetched allowed users:", data);
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
    console.log("Checking for differences in survey data...");
    console.log("Old survey data:", oldSurveyData);
    const surveyID = surveyData.survey.survey_id;
    console.log("Survey ID:", surveyID);

    const oldQuestions = new Map(oldSurveyData.questions.map(q => [q.question_id, q]));
    const newQuestions = new Map(surveyData.questions.map(q => [q.question_id, q]));

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
    try {

        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "survey_id": surveyData.survey.survey_id,
                "survey_title": surveyData.survey.survey_title,
                "survey_description": surveyData.survey.survey_description,
                // "program_id": filteredData.filters[1].equal.program_id,
                "program_id": filteredData.filters[1].equal.program_id,
                "period_start": surveyData.survey.period_start,
                "period_end": surveyData.survey.period_end
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