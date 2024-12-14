document.addEventListener('DOMContentLoaded', () => {
    const param = "id"
    const searchParams= new URLSearchParams(window.location.search);
    document.getElementById('questionsTab').setAttribute('href', `/admin/dashboard/survey/?id=${searchParams.get(param)}`);
    document.getElementById('responsesTab').setAttribute('href', `/admin/dashboard/survey/responses?id=${searchParams.get(param)}`);

    const surveyID = {
        "survey_id": searchParams.get(param),
    }
    const rawData = loadResponses(surveyID);
    const parsedData = groupQuestionsQuestionsByQuestionID(rawData);
    console.log("Parsed Data", parsedData);

});

function getQuestions(data){
    var result = response.result
    var [base] = result

    var baseResponseJson = JSON.parse(base.response_json)
    for(item of baseResponseJson){
        var {question_id} = item
        fetch
    }
}

function groupQuestionsByQuestionID(data) {
    const groupedResponses = {};

    data.result.forEach(({ response_id, response_json, submitted_at }) => {
        const responses = JSON.parse(response_json); // Parse the response_json string

        responses.forEach(({ question_id, answer, rating }) => {
            if (!groupedResponses[question_id]) {
                groupedResponses[question_id] = [];
            }

            groupedResponses[question_id].push({
                response_id,
                answer: answer || rating,
                submitted_at
            });
        });
    });

    return groupedResponses;
}


async function loadQuestions(surveyID) {
    const url = `http://localhost:2020/api/survey-service/questions/${surveyID}/`;
    try {
        const response = await fetch (url ,{
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyID),
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch surveys:', error.message);
        return [];
    }
}

async function loadResponses(surveyID){
    const url = "http://localhost:2020/api/survey-service/responses";
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyID),
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch surveys:', error.message);
        return [];
    }
}