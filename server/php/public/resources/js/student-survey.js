// const surveyData = {
//     "survey_id": 1,
//     "survey_title": "CS Department Evaluation 2024",
//     "questions": [
//         {
//             "question_id": 1,
//             "question_text": "Question text goes here",
//             "question_type": "multiple_choice",
//             "options": [
//                 "Strongly Disagree",
//                 "Disagree",
//                 "Neutral",
//                 "Agree",
//                 "Strongly Agree"
//             ],
//              "scale": null
//         },
//         {
//             "question_id": 2,
//             "question_text": "Question text goes here",
//             "question_type": "essay",
//             "options": [],
//             "scale": null
//         },
//         {
//             "question_id": 3,
//             "question_text": "Question text goes here",
//             "question_type": "rating",
//             "options": null,
//             "scale": 5
//         }
//     ]
// };

// sessionStorage.setItem('questionnaireData', JSON.stringify(surveyData));
async function main() {
    // const surveyId = getSurveyIdFromURL(); // Dynamically fetch the survey ID from the URL
    // if (surveyId) {
    //     getQuestions(surveyId); // Call with the dynamic survey ID
    // } else {
    //     console.error("Survey ID not found in URL.");
    // }
    generateQuestionDoms();
}

// Helper function to extract the survey ID from the URL
// function getSurveyIdFromURL() {
    // const params = new URLSearchParams(window.location.search);
    // return params.get("id"); //This is assuming the URL passed by student-homepage.js has a parameter id
// }

// async function getQuestions(id){
//     var response = await fetch("http://localhost:8888/student/survey?id="+id)
//     var data = await response.json()
//     await sessionStorage.setItem('questionnaireData', JSON.stringify(data))
//     generateQuestionDoms()
// }

function generateQuestionDoms(){
    const storedQuestionnaireData = sessionStorage.getItem('questionnaireData');

    //Guard clause to check if sessionStorage is empty or not
    if(!storedQuestionnaireData){
        console.error("NO survey data found in sessionStorage")
        return
    }

    console.log("Using survey data from sessionStorage");

    // Parse the stored datas
    const parsedQuestionnaires = JSON.parse(storedQuestionnaireData);

    // Check if data.questions exists and is an array
    if (!parsedQuestionnaires.questions || !Array.isArray(parsedQuestionnaires.questions)) {
        console.error("Data does not contain valid questions");
        return;
    }

    // Get the title container
    const titleContainer = document.getElementById('title');

    // Create a new label element for the title
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute("class", "txt-xxl bold");
    titleLabel.innerText = parsedQuestionnaires.survey_title;
    titleContainer.appendChild(titleLabel);

    let questionNo = 1;

    // Populate survey questions dynamically based on the stored data
    parsedQuestionnaires.questions.forEach((question) => {
        switch (question.question_type) {
            case 'multiple_choice':
                generateMultipleChoice(questionNo, question, question.question_id);
                questionNo++;
                break;
            case 'checkbox':
                generateCheckboxQuestion(questionNo, question, question.question_id);
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

//Function to generate HTML for multiple choice type questions
function generateMultipleChoice(questionNo, questionData, id) {
    let question = questionData.question_text
    let questionId = id

    let form = document.getElementById('form')

    // Create the base nodes to be populated
    let questionDiv = document.createElement("div")
    questionDiv.setAttribute("class", "question")
    questionDiv.setAttribute("data-question-type", "multiple_choice")

    let optionsDiv = document.createElement("div")
    optionsDiv.setAttribute("class", "options")

    // Create the nodes with content and proper css attributes
    let questionHeader = document.createElement("div")
    questionHeader.setAttribute("class", "question-header")

    //This generates the node of the question header
    let questionText = document.createElement("p")
    questionText.setAttribute("class", "bold")
    questionText.innerText = questionNo + ". " + question
    questionHeader.appendChild(questionText)

    // For each option in the question data create dom and add to options div
    //      This generates the child nodes of the question div
    questionData.options.forEach((option) => {
        let optionDiv = document.createElement("div")
        optionDiv.setAttribute("class", "option")

        let input = document.createElement("input")
        input.setAttribute("type", "radio")
        input.setAttribute("id", option)
        input.setAttribute("name", questionId)
        input.setAttribute("value", option)
        input.setAttribute("class", "custom-radio")

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

// Function to generate HTML checkbox questions
function generateCheckboxQuestion(questionNo, questionData, id) {
    let question = questionData.question_text
    let questionId = id

    let form = document.getElementById('form')

    // Create the base nodes to be populated
    let questionDiv = document.createElement("div")
    questionDiv.setAttribute("class", "question")
    questionDiv.setAttribute("data-question-type", "checkbox")

    let optionsDiv = document.createElement("div")
    optionsDiv.setAttribute("class", "options")

    // Create the nodes with content and proper css attributes
    let questionHeader = document.createElement("div")
    questionHeader.setAttribute("class", "question-header")

    //This generates the node of the question header
    let questionText = document.createElement("p")
    questionText.setAttribute("class", "bold")
    questionText.innerText = questionNo + ". " + question
    questionHeader.appendChild(questionText)

    // For each option in the question data create dom and add to options div
    //      This generates the child nodes of the question div
    questionData.options.forEach((option) => {
        let optionDiv = document.createElement("div")
        optionDiv.setAttribute("class", "option")

        let input = document.createElement("input")
        input.setAttribute("type", "checkbox")
        input.setAttribute("id", option)
        input.setAttribute("name", questionId)
        input.setAttribute("value", option)
        input.setAttribute("class", "custom-checkbox")

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

//Function to generate HTML for Essay type questions
function generateEssayQuestion(questionNo, questionData, id) {
    let question = questionData.question_text;
    let questionId = id;
    let maxLength = 500; // Set the character limit

    let form = document.getElementById('form');

    // Create the base nodes to be populated
    let questionDiv = document.createElement("div");
    questionDiv.setAttribute("class", "question");
    questionDiv.setAttribute("data-question-type", "essay")

    // Create a container for the question header
    let questionHeader = document.createElement("div");
    questionHeader.setAttribute("class", "question-header");

    // Create the question text node
    let questionText = document.createElement("p");
    questionText.setAttribute("class", "bold");
    questionText.innerText = questionNo + ". " + question;
    questionHeader.appendChild(questionText);

    // Create the textarea container
    let textareaDiv = document.createElement("div");
    textareaDiv.setAttribute("class", "textarea-container");
    textareaDiv.style.position = "relative"; // Position relative for counter placement

    // Create the input area itself
    let textarea = document.createElement("textarea");
    textarea.setAttribute("id", id);
    textarea.setAttribute("name", id);
    textarea.setAttribute("rows", "3");
    textarea.setAttribute("cols", "30");
    textarea.setAttribute("placeholder", "Type your answer here...");
    textarea.setAttribute("maxlength", maxLength);

    // Create the character counter
    let charCounter = document.createElement("div");
    charCounter.setAttribute("class", "char-counter");
    charCounter.innerText = `0/${maxLength} characters used`;

    // Event listener to enforce character limit and update counter
    textarea.addEventListener("input", function () {
        const currentLength = textarea.value.length;

        if (currentLength > maxLength) {
            textarea.value = textarea.value.substring(0, maxLength); // Trim to max length
        }

        // Update the character counter
        charCounter.innerText = `${textarea.value.length}/${maxLength} characters used`;
    });

    // Append textarea and counter to the textarea container
    textareaDiv.appendChild(textarea);
    textareaDiv.appendChild(charCounter);

    // Append question header and textarea container to the question div
    questionDiv.appendChild(questionHeader);
    questionDiv.appendChild(textareaDiv);

    // Append the question div to the form element
    form.appendChild(questionDiv);
}

//Function to generate HTML for rating type questions
function generateRatingQuestion(questionNo, questionData, id) {
    let question = questionData.question_text;
    let scale = questionData.scale; // Get the maximum rating scale (e.g., 5)
    let questionId = id;

    let form = document.getElementById('form');

    // Create the base nodes to be populated
    let questionDiv = document.createElement("div");
    questionDiv.setAttribute("class", "question");
    questionDiv.setAttribute("data-question-type", "rating")

    let ratingDiv = document.createElement("div");
    ratingDiv.setAttribute("class", "rating");

    // Create the nodes with content and proper CSS attributes
    let questionHeader = document.createElement("div");
    questionHeader.setAttribute("class", "question-header");

    // Generate the question header
    let questionText = document.createElement("p");
    questionText.setAttribute("class", "bold");
    questionText.innerText = questionNo + ". " + "On a Scale of 1 to " + questionData.scale + ", " + question;
    questionHeader.appendChild(questionText);

    // For each rating option from 1 up to the scale, create a radio button and label
    for (let i = 1; i <= scale; i++) {
        let optionDiv = document.createElement("div");
        optionDiv.setAttribute("class", "flex-col");

        let input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("id", `rating-${i}`);
        input.setAttribute("name", questionId);
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

function generateButtonNav(){
    console.log("generating nav buttons")
    let mainContainer = document.createElement("div")
    mainContainer.setAttribute("class", "flex-container h-align-center row")
    mainContainer.setAttribute("id", "button-container")

    let backButton = document.createElement("button")
    backButton.setAttribute("class", "btn-primary-m")
    backButton.innerText = "Back"

    let submitButton = document.createElement("button");
    submitButton.setAttribute("class", "btn-primary-m");
    submitButton.setAttribute("id", "submit-button");
    submitButton.innerText = "Submit";

    let spacer = document.createElement("div")
    spacer.setAttribute("class", "spacer")

    mainContainer.appendChild(backButton)
    mainContainer.appendChild(spacer)
    mainContainer.appendChild(submitButton)
    document.getElementById("form").appendChild(mainContainer)
}

main()