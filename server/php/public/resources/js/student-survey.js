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

async function main(){
    getQuestions(1)// change the parameter depending on the query
}

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
        let questionNo = 1
        switch (question.question_type) {
            case 'multiple_choice':
                generateMultipleChoice(questionNo ,question.question_json, question.question_id);
                break;
            case 'rating':
                //generateRating(question.question_json);
                break;
            case 'text_input':
                //generateTextInput(question.question_json);
                break;
            default:
                console.warn("Unknown question type:", question.question_type);
                break;
        }
        questionNo++
    });

    // Bind event listeners only after elements are dynamically created
    console.log("Invoking generateNavs")
    generateButtonNav();
}

// Function to generate HTML for multiple choice questions
function generateMultipleChoice(questionNo,questionData, id) {
    var question = questionData.question
    var questionId = id
    console.log(question)

    var form = document.getElementById('form')
    
    // Create the base nodes to be populated
    var questionDiv = document.createElement("div")
    questionDiv.setAttribute("class","question")

    var optionsDiv = document.createElement("div")
    optionsDiv.setAttribute("class", "options")

    // Create the nodes with content and proper css attributes
    var questionHeader = document.createElement("div")
    questionHeader.setAttribute("class","question-header")
    
    //This generates the node of the question header
    var questionText = document.createElement("p")
    questionText.setAttribute("class", "bold")
    questionText.innerText = questionNo+". "+question
    questionHeader.appendChild(questionText)

    // For each option in the question data create dom and add to options div
    //      This generates the child nodes of the question div
    questionData.options.forEach((option) =>{
        console.log(option)
        console.log(questionId)
        let optionDiv = document.createElement("div")
        optionDiv.setAttribute("class","option")

        let input = document.createElement("input")
        input.setAttribute("type", "checkbox")
        input.setAttribute("id",option)
        input.setAttribute("name",questionId)
        input.setAttribute("value",option)

        let label = document.createElement("label")
        label.setAttribute("for", option)
        label.innerText = option

        optionDiv.appendChild(input)
        optionDiv.appendChild(label)

        optionsDiv.appendChild(optionDiv)
    })
    //Append the child nodes of the question div to itself
    questionDiv.appendChild(questionHeader)
    questionDiv.appendChild(optionsDiv)

    //Append the question div to the form element
    form.appendChild(questionDiv)
}

function generateButtonNav(){
    console.log("generating nav buttons")
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

main()