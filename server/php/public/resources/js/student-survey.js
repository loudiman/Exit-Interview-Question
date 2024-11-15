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
async function main() {
    const surveyId = getSurveyIdFromURL(); // Dynamically fetch the survey ID from the URL
    if (surveyId) {
        getQuestions(surveyId); // Call with the dynamic survey ID
    } else {
        console.error("Survey ID not found in URL.");
    }
}

// Helper function to extract the survey ID from the URL
function getSurveyIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); //This is assuming the URL passed by student-homepage.js has a parameter id
}

async function getQuestions(id){
    var response = await fetch("http://localhost:8888/student/survey?id="+id)
    var data = await response.json()
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
    if (!data.questions || !Array.isArray(data.questions)) {
        console.error("Data does not contain valid questions");
        return;
    }

    // Get the title container
    const titleContainer = document.getElementById('title');

    // Create a new label element for the title
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute("class", "txt-xxl bold");
    titleLabel.innerText = data.survey_title;
    titleContainer.appendChild(titleLabel);

    var questionNo = 1;

    // Populate survey questions dynamically based on the stored data
    data.questions.forEach((question) => {
        switch (question.question_type) {
            case 'multiple_choice':
                generateMultipleChoice(questionNo, question, question.question_id);
                questionNo++;
                break;
            case 'rating':
                generateRatingQuestion(questionNo, question, question.question_id);
                questionNo++;
                break;
            case 'essay':
                generateEssayQuestion(questionNo, question, question.question_id);
                questionNo++;
                break;
            default:
                console.warn("Unknown question type:", question.question_type);
                break;
        }
    });

    // Bind event listeners only after elements are dynamically created
    console.log("Invoking generateButtonNav");
    generateButtonNav();
}

// Function to generate HTML for multiple choice questions
function generateMultipleChoice(questionNo,questionData, id) {
    var question = questionData.question_text
    var questionId = id

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

function generateRatingQuestion(questionNo, questionData, id) {
    var question = questionData.question_text;
    var scale = questionData.scale; // Get the maximum rating scale (e.g., 5)
    var questionId = id;

    var form = document.getElementById('form');

    // Create the base nodes to be populated
    var questionDiv = document.createElement("div");
    questionDiv.setAttribute("class", "question");

    var ratingDiv = document.createElement("div");
    ratingDiv.setAttribute("class", "rating");

    // Create the nodes with content and proper CSS attributes
    var questionHeader = document.createElement("div");
    questionHeader.setAttribute("class", "question-header");

    // Generate the question header
    var questionText = document.createElement("p");
    questionText.setAttribute("class", "bold");
    questionText.innerText = questionNo + ". " + question + " (Scale from 1 to " + questionData.scale+")";
    questionHeader.appendChild(questionText);

    // For each rating option from 1 up to the scale, create a radio button and label
    for (let i = 1; i <= scale; i++) {
        let optionDiv = document.createElement("div");
        optionDiv.setAttribute("class", "flex-col");

        let input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("id", `rating-${i}`);
        input.setAttribute("name", `questionID-${questionId}`);
        input.setAttribute("value", i); // Sets the value to the rating number chosen

        let label = document.createElement("label");
        label.setAttribute("for", `rating-${i}`);
        label.innerText = i; // Shows the rating number

        // Apply custom styles to the radio input here
        input.classList.add('custom-radio'); // Add class for custom styles

        // Apply custom styles to the label
        label.classList.add('custom-label'); // Add class for custom label styles

        // Add an event listener to handle the "selected" effect when the radio button is clicked
        input.addEventListener('change', function () {
            // Remove the selected effect from all radio buttons first
            const allRadioButtons = document.querySelectorAll(`input[name="questionID-${questionId}"]`);
            allRadioButtons.forEach(radio => {
                radio.classList.remove('selected');  // Remove the selected class
            });

            // Add the selected effect to the clicked radio button
            input.classList.add('selected');
        });

        // Add label above the radio button in the same div
        optionDiv.appendChild(label);
        optionDiv.appendChild(input);

        // Append the option div (with the radio and label) to the parent container
        ratingDiv.appendChild(optionDiv);
    }

    // Append the child nodes of the question div
    questionDiv.appendChild(questionHeader);
    questionDiv.appendChild(ratingDiv);

    // Append the question div to the form element
    form.appendChild(questionDiv);
}

//Keeping the code below in case of change of mind
// function generateRatingQuestion(questionNo, questionData, id) {
//     const question = questionData.question_text;
//     const scale = questionData.scale; // Get the maximum rating scale (e.g., 5)
//     const questionId = id;
//
//     const form = document.getElementById('form');
//
//     // Create the base nodes to be populated
//     const questionDiv = document.createElement("div");
//     questionDiv.setAttribute("class", "question");
//
//     const questionHeader = document.createElement("div");
//     questionHeader.setAttribute("class", "question-header");
//
//     // Generate the question header
//     const questionText = document.createElement("p");
//     questionText.setAttribute("class", "bold");
//     questionText.innerText = questionNo + ". " + question;
//     questionHeader.appendChild(questionText);
//
//     // Slider container
//     const sliderContainer = document.createElement("div");
//     sliderContainer.setAttribute("class", "slider-container");
//
//     // Create the slider input element
//     const slider = document.createElement("input");
//     slider.setAttribute("type", "range");
//     slider.setAttribute("id", `slider-${questionId}`);
//     slider.setAttribute("min", "1");
//     slider.setAttribute("max", scale.toString());
//     slider.setAttribute("value", Math.ceil(scale / 2).toString()); // Default to middle of scale
//
//     // Create the slider value display
//     const sliderValueDisplay = document.createElement("span");
//     sliderValueDisplay.setAttribute("id", `slider-value-${questionId}`);
//     sliderValueDisplay.classList.add("slider-value");
//     sliderValueDisplay.textContent = slider.value;
//
//     // Event listener to update display as slider moves
//     slider.addEventListener("input", function () {
//         const value = slider.value;
//         sliderValueDisplay.textContent = value;
//     });
//
//     // Append elements to their respective containers
//     sliderContainer.appendChild(slider);
//     sliderContainer.appendChild(sliderValueDisplay);
//
//     // Append all to question div
//     questionDiv.appendChild(questionHeader);
//     questionDiv.appendChild(sliderContainer);
//
//     // Append the question div to the form element
//     form.appendChild(questionDiv);
// }

function generateEssayQuestion(questionNo, questionData, id) {
    var question = questionData.question_text;
    var questionId = id;

    var form = document.getElementById('form');

    // Create the base nodes to be populated
    var questionDiv = document.createElement("div");
    questionDiv.setAttribute("class", "question");

    // Create a container for the question header
    var questionHeader = document.createElement("div");
    questionHeader.setAttribute("class", "question-header");

    // Create the question text node
    var questionText = document.createElement("p");
    questionText.setAttribute("class", "bold");
    questionText.innerText = questionNo + ". " + question;
    questionHeader.appendChild(questionText);

    // Create the textarea input for essay-type question
    var textareaDiv = document.createElement("div");
    textareaDiv.setAttribute("class", "textarea-container");

    var textarea = document.createElement("textarea");
    textarea.setAttribute("id", id);  // Use questionId as textarea id
    textarea.setAttribute("name", id);  // Set name to questionId
    textarea.setAttribute("rows", "4");  // Default rows for the textarea
    textarea.setAttribute("cols", "50");  // Default columns for the textarea
    textarea.setAttribute("placeholder", "Type your answer here...");

    // Append textarea to the textarea container
    textareaDiv.appendChild(textarea);

    // Append question header and textarea container to the question div
    questionDiv.appendChild(questionHeader);
    questionDiv.appendChild(textareaDiv);

    // Append the question div to the form element
    form.appendChild(questionDiv);
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

main()//what even is his for?