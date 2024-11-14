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

    if (storedSurveyData) {
        console.log("Using survey data from sessionStorage");

        // Parse the stored data
        const data = JSON.parse(storedSurveyData);
        console.log("generating doms")
        console.log(data)

        // Check if data.questions exists and is an array
        if (data.questions && Array.isArray(data.questions)) {
            // Populate survey questions dynamically based on the stored data
            data.questions.forEach((question, index) => {
                switch (question.question_type) {
                    case 'multiple_choice':
                        questionHTML = generateMultipleChoice(question.question_json);
                        break;
                    case 'rating':
                        questionHTML = generateRating(question.question_json);
                        break;
                    case 'text_input':
                        questionHTML = generateTextInput(question.question_json);
                        break;
                    default:
                        console.warn("Unknown question type:", question.question_type);
                        break;
                }

                // Insert the generated question HTML into the corresponding div
                const surveyDiv = document.querySelectorAll('.survey-template')[index];
                if (surveyDiv) {
                    surveyDiv.innerHTML = questionHTML;
                } else {
                    console.error(`Survey div not found for question index: ${index}`);
                }
            });

            // Bind event listeners only after elements are dynamically created
            bindDynamicEventListeners();
        } else {
            console.error("Data does not contain a valid 'questions' array.");
        }
    } else {
        console.error("No survey data found in sessionStorage");
    } 
}

// Function to generate HTML for multiple choice questions
function generateMultipleChoice(questionData) {
    var form = document.getElementById("form")
    
}
