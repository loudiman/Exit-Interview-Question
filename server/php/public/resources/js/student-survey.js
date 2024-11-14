// const surveyData = {
//     "questions": [
//       {
//         "question_json": {
//           "question": "Which network topology is most resilient to failures?",
//           "options": ["Star", "Ring", "Mesh", "Bus"]
//         },
//         "question_type": "multiple_choice"
//       },
//       {
//         "question_json": {
//           "question": "Rate your experience with our services.",
//           "options": []
//         },
//         "question_type": "rating"
//       },
//       {
//         "question_json": {
//           "question": "Please provide additional feedback.",
//           "options": []
//         },
//         "question_type": "text_input"
//       }
//     ]
//   };
  
// sessionStorage.setItem('questionnaireData', JSON.stringify(surveyData));
getQuestions(1)

async function getQuestions(id){
    var response = await fetch("http://localhost:8888/student/survey?id="+id)
    var data = await response.json()
    console.log(data)
    await sessionStorage.setItem('questionnaireData', JSON.stringify(data))
    generateQuestionDoms()
}

function generateQuestionDoms(){
    const storedSurveyData = sessionStorage.getItem('questionnaireData');

    //Guard clause to check if sessionStorage is empty or not
    if(!storedSurveyData){
        console.error("NO survey data found in sessionStorage")
        return
    }

    console.log("Using survey data from sessionStorage");

    // Parse the stored data
    const data = JSON.parse(storedSurveyData);

    // Check if data.questions exists and is an array
    if(!data.questions && Array.isArray(data.questions)){
        console.error("Data does not contain valid questions")
        return
    }

    // Populate survey questions dynamically based on the stored data
    data.questions.forEach((question, index) => {
        switch (question.question_type) {
            case 'multiple_choice':
                generateMultipleChoice(question.question_json);
                break;
            case 'rating':
                generateRating(question.question_json);
                break;
            case 'text_input':
                generateTextInput(question.question_json);
                break;
            default:
                console.warn("Unknown question type:", question.question_type);
                break;
        }
    });

    // Bind event listeners only after elements are dynamically created
    bindDynamicEventListeners();
}

// Function to generate HTML for multiple choice questions
function generateMultipleChoice(questionData) {
    var question

    var form = document.getElementById('form')
    
    var questionDiv = document.createElement("div")
    questionDiv.setAttribute("class","question")
    
}

function generateButtonNav(){
    var mainContainer = document.createElement("div")
    mainContainer.setAttribute("class","flex-container h-align-center row")
    mainContainer.setAttribute("id","button-container")

    var backButton = document.createElement("button")
    backButton.setAttribute("class","btn-primary-m")
    backButton.innerText = "Back"

    var submitButton = document.createElement("button")
    submitButton.setAttribute("class","btn-primary-m")
    submitButton.innerText = "Submit"

    var spacer = document.createElement("div")
    spacer.setAttribute("class","spacer")

    mainContainer.appendChild(backButton)
    mainContainer.appendChild(spacer)
    mainContainer.appendChild(submitButton)
    
    document.getElementById("form").appendChild(mainContainer)
}

var newDiv = document.createElement("div")
newDiv.innerText = "halo"

generateButtonNav()