document.addEventListener('DOMContentLoaded', async () => {
    await createSurveyAnalyticsHTML()
});

async function createSurveyAnalyticsHTML() {
    try {
        const surveyData = await processSurveyData();
        const htmlContent = generateSurveyAnalyticsHTML(surveyData);

        const responseAnalyticsDiv = document.querySelector('.response-analytics');
        if (responseAnalyticsDiv) {
            responseAnalyticsDiv.innerHTML = '<h2>Response Analytics</h2>';
            responseAnalyticsDiv.insertAdjacentHTML('beforeend', htmlContent);
        } else {
            console.error('Response analytics div not found');
        }

        return htmlContent;
    } catch (error) {
        console.error('Error generating survey analytics HTML:', error);
    }
}

/*
Function to generate the response-analytics div
 */
function generateSurveyAnalyticsHTML(surveyData) {
    const getResponseStatus = (responded) => {
        return responded === 1 ? 'Responded' : 'Pending';
    };

    // Function to generate HTML for a specific survey
    const generateSingleSurveyHTML = (survey) => {
        // Calculate total respondents
        const totalRespondents = survey.respondents.length;
        const respondedCount = survey.respondents.filter(r => r.responded === 1).length;

        // Generate rows for respondents
        const respondentRows = survey.respondents.map(respondent => `
            <div class="response-row">
                <span>${respondent.username}</span>
                <span>${respondent.first_name} ${respondent.last_name}</span>
                <span>${respondent.program_name}</span>
                <span>${getResponseStatus(respondent.responded)}</span>
            </div>
        `).join('');

        return `
            <div class="analytics-card">
                <div class="response-summary">
                    <span id="survey-title">${survey.survey_title}</span>
                    <span id="total-respondents">${respondedCount}/${totalRespondents}</span>
                </div>
                <p class="survey-description">${survey.survey_description}</p>
                <div class="response-row-titles">
                    <span>ID Number</span>
                    <span>Name</span>
                    <span>Program</span>
                    <span>Status</span>
                </div>
                <div class="response-details">
                    ${respondentRows}
                </div>
            </div>
        `;
    };

    // Generate HTML for all surveys
    return surveyData ? surveyData.map(generateSingleSurveyHTML).join('') : '';
}

/*
Fetch summary of all surveys
Sample response:
[
    {
        "survey_id": 1,
        "survey_title": "CS Department Evaluation 2024",
        "survey_description": "CS Description",
        "program_id": {
            "program_id": [
                1
            ]
        },
        "period_start": "2024-12-15T23:00:00.000Z",
        "period_end": "2024-12-20T15:00:00.000Z",
        "total_responded": 1,
        "total_responders": 1
    },
    {
        "survey_id": 2,
        "survey_title": "IT Department Evaluation 2024",
        "survey_description": "IT Description",
        "program_id": {
            "program_id": [
                2
            ]
        },
        "period_start": "2024-11-17T00:00:00.000Z",
        "period_end": "2024-11-20T15:00:00.000Z",
        "total_responded": 0,
        "total_responders": 1
     }
 ]
 */
async function fetchSurveys() {
    const url = "http://localhost:2020/api/survey-service/survey-summary";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
        return null;  // Ensure null is returned on error to handle it gracefully
    }
}

/*
Fetch the respondents per one survey
Sample response:
[
    {
        "username": 2233672,
        "given_name": "Lou Diamond",
        "last_name": "Morados",
        "responded": 0
    }
]
 */
async function fetchRespondents(surveyId) {
    console.log("Trying to fetch respondents");
    const url = 'http://localhost:2020/api/survey-service/respondents';
    const data = {
        survey_id: surveyId
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error for survey_id ${surveyId}:`, error);
        return {survey_id: surveyId, error: error.message};
    }
}

/*
Fetch a user's program by username
Sample response:
 */
async function fetchStudent(username) {
    const url = `http://localhost:2020/api/user-service/student/${username}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error for username ${username}:`, error);
        return {username: username, error: error.message};
    }
}

/*
To fetch all programs that will be used to get program name of student
Sample response:
{
    "availability": [
        {
            "program_id": 1,
            "program_name": "Computer Science"
        },
        {
            "program_id": 2,
            "program_name": "Information Technology"
        },
        {
            "program_id": 3,
            "program_name": "Multimedia Arts"
        }
    ]
}
 */
async function fetchPrograms(){
    const url = "http://localhost:2020/api/program-service/programs"
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error fetching Programs:`);
        return {error: error.message};
    }
}

/*
To process everything for what I need in this page.
This was annoying to formulate omg (the json structure)
Sample response:
[
  {
    "survey_id": 1,
    "survey_title": "CS Department Evaluation 2024",
    "survey_description": "CS Description",
    "program_id": {
      "program_id": [
        1
      ]
    },
    "total_responded": 1,
    "total_responders": 1,
    "respondents": [
      {
        "first_name": "Mark Lestat",
        "last_name": "Agustin",
        "responded": 1,
        "username": 2233915,
        "student_program_id": 3
      }
    ]
  }
]
 */
async function processSurveyData() {
    // First, fetch all available programs
    const programsResponse = await fetchPrograms();
    const programs = programsResponse.availability || [];

    const surveys = await fetchSurveys();
    if (!surveys) {
        console.error("No surveys fetched");
        return null;
    }

    const surveyData = [];

    for (const survey of surveys) {
        const respondents = await fetchRespondents(survey.survey_id);

        const processedRespondents = await Promise.all(respondents.map(async (respondent) => {
            const studentDetails = await fetchStudent(respondent.username);

            // Find the program name based on student's program_id
            const programName = programs.find(
                program => program.program_id === studentDetails.program_id
            )?.program_name || 'Unknown Program';

            return {
                first_name: respondent.given_name,
                last_name: respondent.last_name,
                responded: respondent.responded,
                username: respondent.username,
                student_program_id: studentDetails.program_id || null,
                program_name: programName
            };
        }));

        const surveyDataItem = {
            survey_id: survey.survey_id,
            survey_title: survey.survey_title,
            survey_description: survey.survey_description,
            program_id: survey.program_id,
            total_responded: survey.total_responded,
            total_responders: survey.total_responders,
            respondents: processedRespondents
        };

        surveyData.push(surveyDataItem);
    }
    return surveyData;
}