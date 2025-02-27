const config = require('./config.js');
const API = config.API_URL

function getSurveyIdFromURL() {
    console.log("Getting survey ID from URL");
    const params = new URLSearchParams(window.location.search);
    console.log("Params: ", params.get("id"));
    return params.get("id");     
}

document.addEventListener('DOMContentLoaded', async () => {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    const surveyId = getSurveyIdFromURL();
    console.log("Survey ID", surveyId);
    document.getElementById('questionsTab').setAttribute('href', `/admin/dashboard/survey/?survey_id=${surveyId}`);
    document.getElementById('responsesTab').setAttribute('href', `/admin/dashboard/survey/responses?id=${surveyId}`);

    try {
        // Wait for resources to load
        const { questions, responses } = await loadMultipleResources(surveyId);
        
        // Verify data is loaded
        if (questions && responses) {
            console.log('Resources loaded successfully');
            console.log('Questions:', questions);
            console.log('Responses:', responses);    
            
            const questionsMap = new Map();
            questions.questions.forEach(question => {
                questionsMap.set(question.question_id, question);
            });

            // Match responses with questions
            const matchedData = [];
            responses.result.forEach(response => {
                const parsed = JSON.parse(response.response_json);
                parsed.forEach(item => {
                    const matchingQuestion = questionsMap.get(item.question_id);
                    if (matchingQuestion) {
                        matchedData.push({
                            questionId: item.question_id,
                            question: JSON.parse(matchingQuestion.question_json).question,
                            options: JSON.parse(matchingQuestion.question_json).options,
                            scale: JSON.parse(matchingQuestion.question_json).scale,
                            questionType: matchingQuestion.question_type,
                            answer: item[`${matchingQuestion.question_type}_ans`]
                        });
                    }
                });
            });

            // Log matched data
            console.table(matchedData);
            console.log(typeof matchedData);

            // Set a callback to run when the Google Visualization API is loaded.
            await google.charts.setOnLoadCallback(createCharts(preprocessor(matchedData)));
        }
    } catch (error) {
        console.error('Failed to load resources:', error);
        showErrorMessage('Failed to load survey data');
    }
});

function preprocessor(data) {
    // Group responses by questionId
    const groupedResponses = data.reduce((acc, curr) => {
        if (!acc[curr.questionId]) {
            acc[curr.questionId] = {
                questionId: curr.questionId,
                question: curr.question,
                options: curr.options,
                scale: curr.scale,
                questionType: curr.questionType,
                responses: []
            };
        }
        acc[curr.questionId].responses.push(curr.answer);
        return acc;
    }, {});

    // Convert to array and sort by questionId
    const aggregatedData = Object.values(groupedResponses).sort((a, b) => 
        a.questionId - b.questionId
    );
    console.log("Aggregated Data:", aggregatedData);

    return aggregatedData;
}

async function createCharts(processedData) {
    console.log(typeof processedData);
    console.log(processedData);
    const chartsContainer = document.getElementById('charts-container');
    chartsContainer.innerHTML = ''; // Clear existing charts

    processedData.forEach((questionData, index) => {
        const chartDiv = document.createElement('div');
        chartDiv.id = `chart_${index}`;
        // Quick fix to add some styling
        chartDiv.style.marginBottom = '12px'; 
        chartDiv.style.borderRadius = '8px';
        chartDiv.style.width = '100%';
        chartDiv.style.maxWidth = '770px';
        chartDiv.style.backgroundColor = 'white';
        chartDiv.style.display = 'flex';
        chartDiv.style.justifyContent = 'center';
        chartDiv.style.paddingTop = '12px';
        chartDiv.style.paddingRight = '12px';
        chartDiv.style.paddingBottom = '24px';
        chartDiv.style.paddingLeft = '24px';
        chartsContainer.appendChild(chartDiv);

        console.log("Question Data", questionData);

        switch(questionData.questionType) {
            case 'rating':
                drawRatingChart(questionData, chartDiv.id);
                break;
            case 'multiple_choice':
                drawMultipleChoiceChart(questionData, chartDiv.id);
                break;
            case 'essay':
                drawEssayChart(questionData, chartDiv.id);
            // Add more cases for other question types
        }
    });

    const chartContainers = Array.from(chartsContainer.children);
    console.log("Chart Containers", chartContainers);
}

function drawEssayChart(questionData, containerId) {
    document.getElementById(containerId).style.display = 'block';

    const questionDiv = document.createElement('div');
    questionDiv.style.display = 'flex';
    questionDiv.style.flexDirection = 'column';
    questionDiv.style.alignItems = 'flex-start';
    questionDiv.style.marginBottom = '24px';
    questionDiv.style.marginTop = '8px';
    questionDiv.style.marginRight = '8px';

    const questionText = document.createElement('span');
    questionText.textContent = questionData.question;
    questionDiv.appendChild(questionText);

    const responsesText = document.createElement('span');
    responsesText.textContent = '';
    questionDiv.appendChild(responsesText);

    const essayDiv = document.createElement('div');
    essayDiv.style.maxHeight = '400px';
    essayDiv.style.overflowY = 'auto';
    essayDiv.style.padding = '12px';
    essayDiv.style.color = 'rgb(32, 33, 36)';;

    questionData.responses.forEach(response => {
        const responseText = document.createElement('div');
        responseText.style.lineHeight = '20px';
        responseText.textContent = response;
        responseText.style.marginTop = '4px';
        responseText.style.padding = '10px';
        responseText.style.borderRadius = '4px';
        responseText.style.backgroundColor = 'rgb(248,249,250)';
        essayDiv.appendChild(responseText);
    });

    document.getElementById(containerId).appendChild(questionDiv);
    document.getElementById(containerId).appendChild(essayDiv);
}

function drawRatingChart(questionData, containerId) {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Rating');
    data.addColumn('number', 'Responses');
    
    // Create rating distribution array (1-5)
    const ratings = Array(5).fill(0);
    questionData.responses.forEach(response => {
        ratings[response - 1]++;
    });

    // Add rows for each rating
    for(let i = 0; i < 5; i++) {
        data.addRow([`${i + 1} Stars`, ratings[i]]);
    }

    const options = {
        title: questionData.question,
        width: 600,
        height: 300,
        legend: { position: 'none' },
        vAxis: {
            minValue: 0,
            format: '0'
        },
        animation: {
            startup: true,
            duration: 1000,
            easing: 'out'
        },
        colors: ['#4285F4']
    };

    const chart = new google.visualization.ColumnChart(document.getElementById(containerId));
    chart.draw(data, options);
}

function drawMultipleChoiceChart(questionData, containerId) {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Multiple Choice');
    data.addColumn('number', 'Count');
    
    // Count responses for each option
    const responseCounts = {};
    questionData.responses.forEach(response => {
        console.log("Response option", response);
        responseCounts[response] = (responseCounts[response] || 0) + 1;
    });

    console.log("Response Counts", responseCounts);

    // Add rows for each option
    questionData.options.forEach(option => {
        data.addRow([option, responseCounts[option] || 0]);
    });

    const options = {
        title: questionData.question,
        titlePosition: 'out',
        titleTextStyle: {
            alignment: 'start'  // Aligns title to the left
        },
        width: 600,
        height: 300,
        legend: { 
            position: 'right',
            maxLines: 5
        },
        sliceVisibilityThreshold: 0,
        is3D: true
    };

    const chart = new google.visualization.PieChart(document.getElementById(containerId));
    chart.draw(data, options);
}

async function loadMultipleResources(surveyId) {
    try {
        const [questions, responses] = await Promise.all([
            loadQuestions(surveyId),
            loadResponses(surveyId)
        ]);
        return { questions, responses };
    } catch (error) {
        console.error('Error loading resources:', error);
    }
}

async function loadQuestions(surveyID) {
    const url = `${API}/survey-service/questions/${surveyID}/`;
    try {
        const response = await fetch (url ,{
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.table('Questions:', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch surveys:', error.message);
        return [];
    }
}

async function loadResponses(surveyID){
    const url = `${API}survey-service/responses`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                survey_id: surveyID
            })
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Responses:', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch surveys:', error.message);
        return [];
    }
}


// fix this
// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(() => loadResponses('4'));

// async function loadResponses(surveyID){
//     const url = "http://localhost:2020/api/survey-service/responses";
//     try { 
//         const response = await fetch(url, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 survey_id: surveyID
//             })
//         });
//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('Responses:', data); // Log the data to inspect its structure

//         // Check if data.result exists and is an array
//         if (!data || !Array.isArray(data.result)) {
//             throw new Error('Expected data.result to be an array');
//         }

//         // Aggregate responses per question
//         const questionResponses = {};
//         data.result.forEach(response => {
//             const responseJson = JSON.parse(response.response_json);
//             responseJson.forEach(answer => {
//                 const questionId = answer.question_id;
//                 if (!questionResponses[questionId]) {
//                     questionResponses[questionId] = 0;
//                 }
//                 questionResponses[questionId]++;
//             });
//         });

//         // Convert aggregated data to array format for the chart
//         const chartData = Object.keys(questionResponses).map(questionId => {
//             return [`Question ${questionId}`, questionResponses[questionId]];
//         });

//         drawChart(chartData);
//         return chartData;
//     } catch (error) {
//         console.error('Failed to fetch surveys:', error.message);
//         showErrorMessage(error.message);
//         return [];
//     }
// }

// function drawChart(data) {
//     const dataTable = new google.visualization.DataTable();
//     dataTable.addColumn('string', 'Question');
//     dataTable.addColumn('number', 'Responses');

//     data.forEach(item => {
//         dataTable.addRow(item);
//     });

//     const options = {
//         title: 'Responses per Question',
//         width: 600,
//         height: 400
//     };

//     const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
//     chart.draw(dataTable, options);
// }

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Error: ${message}`;
    document.body.appendChild(errorDiv);
}