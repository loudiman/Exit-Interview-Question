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
// async function main() {
    // const surveyId = getSurveyIdFromURL(); // Dynamically fetch the survey ID from the URL
    // if (surveyId) {
    //     getQuestions(surveyId); // Call with the dynamic survey ID
    // } else {
    //     console.error("Survey ID not found in URL.");
    // }
// }

generateQuestionDoms()

// Helper function to extract the survey ID from the URL
function getSurveyIdFromURL() {
    // const params = new URLSearchParams(window.location.search);
    // return params.get("id"); //This is assuming the URL passed by student-homepage.js has a parameter id
}

async function getQuestions(id){
    // var response = await fetch("http://localhost:8888/student/survey?id="+id)
    // var data = await response.json()
    // await sessionStorage.setItem('questionnaireData', JSON.stringify(data))
}

function generateQuestionDoms(){
    const storedQuestionnaireData = sessionStorage.getItem('questionnaireData');

    //Guard clause to check if sessionStorage is empty or not
    if(!storedQuestionnaireData){
        console.error("No survey data found in sessionStorage")
        return
    }

    console.log("Using survey data from sessionStorage");

    // Parse the stored questionnaire data
    const parsedQuestionnaires = JSON.parse(storedQuestionnaireData);

    // Check if parsedQuestionnaires.questions exists and is an array
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

    var questionNo = 1;

    // Populate survey questions dynamically based on the stored data
    parsedQuestionnaires.questions.forEach((question) => {
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
    document.getElementById("submit-button").addEventListener("click", () => gatherResponses(parsedQuestionnaires.survey_id));
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

// Function to gather the inputs from form and submit the data
function gatherResponses(surveyId) {
    if (!confirm("You won't be able to edit your answers after you submit. Are you sure you want to proceed?")) {
        return;
    }

    const responseJson = [];
    // const surveyId = new URLSearchParams(window.location.search).get("id");
    const username = sessionStorage.getItem('username');

    if (!username || !surveyId) {
        alert("Missing required information. Please ensure you're logged in and accessing a valid survey.");
        return;
    }

    // Validate and format data types
    const numericUsername = parseInt(username, 10);
    const numericSurveyId = parseInt(surveyId, 10);

    if (isNaN(numericUsername) || isNaN(numericSurveyId)) {
        alert("Invalid username or survey ID format");
        return;
    }

    const questions = document.querySelectorAll(".question");
    let hasUnansweredQuestions = false;

    questions.forEach((questionDiv) => {
        const questionId = questionDiv.querySelector("input, textarea").name;
        const questionType = questionDiv.getAttribute("data-question-type");
        let response = { question_id: parseInt(questionId, 10) };

        switch (questionType) {
            case "multiple_choice":
                const selectedChoice = questionDiv.querySelector("input[type='radio']:checked");
                if (!selectedChoice) {
                    hasUnansweredQuestions = true;
                    return;
                }
                response.answer = selectedChoice.value;
                break;

            case "checkbox":
                const selectedOptions = Array.from(questionDiv.querySelectorAll("input[type='checkbox']:checked"))
                    .map(option => option.value);
                response.answer = selectedOptions;
                break;

            case "essay":
                const essayInput = questionDiv.querySelector("textarea");
                const essayValue = essayInput ? essayInput.value.trim() : "";
                if (!essayValue) {
                    hasUnansweredQuestions = true;
                    return;
                }
                response.answer = essayValue;
                break;

            case "rating":
                const selectedRating = questionDiv.querySelector("input[type='radio']:checked");
                if (!selectedRating) {
                    hasUnansweredQuestions = true;
                    return;
                }
                response.rating = parseInt(selectedRating.value, 10);
                break;
        }

        if (response.answer !== undefined || response.rating !== undefined) {
            responseJson.push(response);
        }
    });

    if (hasUnansweredQuestions) {
        alert("Please answer all questions before submitting.");
        return;
    }

    if (responseJson.length === 0) {
        alert("No responses gathered. Please answer at least one question.");
        return;
    }

    console.log("Gathered responses:", responseJson);

    const payload = {
        username: numericUsername,
        survey_id: numericSurveyId,
        response_json: responseJson
    };

    console.log("Submitting payload:", payload);

    const submitButton = document.getElementById("submit-button");
    if (submitButton) {
        submitButton.disabled = true;
    }

    fetch(`http://localhost:8888/student/survey/questionnaires`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: 'include'
    })
        .then(response => response.text())
        .then(data => {
            console.log("Raw response:", data);
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new Error(`Server returned invalid JSON. Response: ${data}`);
            }
            console.log("Response saved successfully:", data);
            alert("Survey submitted successfully!");
            window.location.href = 'http://localhost:8888/student/surveys';
        })
        .catch((error) => {
            console.error("Error details:", error);
            if (submitButton) {
                submitButton.disabled = false;
            }
            alert(`Failed to submit survey: ${error.message}`);
        });
}

// main()