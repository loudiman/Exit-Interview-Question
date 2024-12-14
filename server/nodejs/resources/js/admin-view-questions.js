// JavaScript for handling admin-view-questions and inserting questions dynamically
document.addEventListener("DOMContentLoaded", () => {
    const surveySummary = getSurveySummary();
    document.getElementById('survey-publish-date').innerHTML = `<strong>Publish Date: ${surveySummary.period_start.toLocaleDateString()}</strong>`;
    document.getElementById('survey-expiration-date').innerHTML = `<strong>Available Until: ${surveySummary.period_end.toLocaleDateString()}</strong>`;
    document.getElementById('survey-respondents').innerHTML = `<strong>Respondents: ${surveySummary.total_responded}</strong>`;
    document.getElementById('questionsTab').setAttribute('href', `/admin/dashboard/survey?id=${getSurveySummary().survey_id}`);
    document.getElementById('responsesTab').setAttribute('href', `/admin/dashboard/survey/responses?id=${getSurveySummary().survey_id}`);

    // Get the title container
    const titleContainer = document.getElementById('title');

    const title = document.createElement('p');
    const titleDescription = document.createElement('p');
    
    title.setAttribute("class", "txt-xxl bold");
    titleDescription.setAttribute("class", "txt-md");

    title.innerText = surveySummary.survey_title;
    titleDescription.innerText = surveySummary.survey_description;

    titleContainer.appendChild(title);
    titleContainer.appendChild(titleDescription);

    // Initialize event listeners
    const backButton = document.getElementById("back_button");
    const sidebar = document.getElementById("sidebar");

    // Back button functionality
    if (backButton) {
        backButton.addEventListener("click", () => {
            // Navigate to the previous page
            window.history.back();
        });
    }

    // Sidebar toggle functionality
    window.toggleSidebar = function () {
        if (sidebar.style.display === "block") {
            sidebar.style.display = "none";
        } else {
            sidebar.style.display = "block";
        }
    };

    generateQuestionDoms();
});

function getSurveySummary() {
    try {
        const surveys = JSON.parse(sessionStorage.getItem('surveysSummaryData'));
        const surveyId = sessionStorage.getItem('surveyId');
        const survey = surveys.find(s => s.survey_id === parseInt(surveyId));

        if (!survey) {
            throw new Error(`Survey with ID ${surveyId} not found`);
        }
        
        return {
            survey_id: survey.survey_id,
            survey_title: survey.survey_title,
            survey_description: survey.survey_description,
            status: survey.status,
            program_id: survey.program_id,
            period_start: new Date(survey.period_start),
            period_end: new Date(survey.period_end),
            total_responded: survey.total_responded,
            total_responders: survey.total_responders
        };
    } catch (error) {
        console.error('Error getting survey:', error);
        return null;
    }
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

    var questionNo = 1;

    // Populate survey questions dynamically based on the stored data
    parsedQuestionnaires.questions.forEach((question) => {
        switch (question.question_type) {
            case 'multiple_choice':
                generateMultipleChoice(questionNo, JSON.parse(question.question_json), question.question_id);
                questionNo++;
                break;
            case 'rating':
                generateRatingQuestion(questionNo, JSON.parse(question.question_json), question.question_id);
                questionNo++;
                break;
            case 'essay':
                generateEssayQuestion(questionNo, JSON.parse(question.question_json), question.question_id);
                questionNo++;
                break;
            default:
                console.warn("Unknown question type:", question.question_type);
                break;
        }
    });
}

function generateMultipleChoice(questionNo, questionData, id) {
    console.log("Generating multiple choice question", questionData);
    let question = questionData.question;
    let questionId = id;

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
    console.log("Generating checkbox question", questionData);
    let question = questionData.question;
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
    console.log("Generating essay question", questionData);
    let question = questionData.question;
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
    console.log("Generating rating question", questionData);
    let question = questionData.question;
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

// Function to insert a question using the DAL
async function insertQuestion(question) {
    try {
        const response = await fetch("/api/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(question)
        });

        if (!response.ok) {
            throw new Error("Failed to insert the question.");
        }

        const result = await response.json();
        return result.insertId;
    } catch (error) {
        throw new Error(error.message);
    }
}
// Function to fetch a question using the DAL
async function fetchQuestion() {
    try {
        const response = await fetch("localhost:2019/api/survey-service/questions/:survey_id", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Failed to insert the question.");
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}