// Static JSON for testing
const staticSurveyData = {
    survey: {
        survey_title: "Sample Survey",
        survey_description: "This is a test survey description",
        program_id: "1234",
        period_start: "2024-01-01",
        period_end: "2024-01-31",
        status: "Draft"
    },
    questions: [
        {
            question_json: {
                question: "What is your favorite color?",
                options: ["Red", "Blue", "Green"],
                scale: []
            },
            question_type: "multiple-choice"
        },
        {
            question_json: {
                question: "Rate your experience with our service.",
                options: [],
                scale: [1, 2, 3, 4, 5]
            },
            question_type: "rating"
        }
    ],
    restrict_students: []
};

// Render Survey UI
function renderSurvey(data) {
    document.getElementById("formTitle").textContent = data.survey.survey_title;
    document.getElementById("formDescription").textContent = data.survey.survey_description;

    const questionsContainer = document.getElementById("questionsContainer");
    questionsContainer.innerHTML = ""; // Clear existing questions

    data.questions.forEach((item, index) => {
        const questionContainer = document.createElement("div");
        questionContainer.classList.add("question-container");
        questionContainer.setAttribute("data-id", index + 1);

        questionContainer.innerHTML = `
            <div class="question-content">
                <div class="question-header">
                    <input type="text" value="${item.question_json.question}" placeholder="Question">
                    <select onchange="updateQuestionContent(this)">
                        <option value="multiple-choice" ${item.question_type === "multiple-choice" ? "selected" : ""}>Multiple Choice</option>
                        <option value="checkbox" ${item.question_type === "checkbox" ? "selected" : ""}>Checkbox</option>
                        <option value="essay" ${item.question_type === "essay" ? "selected" : ""}>Essay</option>
                        <option value="rating" ${item.question_type === "rating" ? "selected" : ""}>Rating</option>
                    </select>
                </div>
                <div class="options">${
            item.question_type === "multiple-choice" || item.question_type === "checkbox"
                ? item.question_json.options.map(opt => `<div class='option-container'><input type="text" value="${opt}" placeholder="Option"><button class="remove-button" onclick="removeOption(this)">Remove</button></div>`).join("")
                : item.question_type === "rating"
                    ? `<select class="max-rating-select">${[...Array(10).keys()].map(i => `<option value="${i + 1}" ${item.question_json.scale.includes(i + 1) ? "selected" : ""}>${i + 1}</option>`).join("")}</select>`
                    : "<textarea placeholder='Enter an answer here' disabled></textarea>"
        }</div>
                <div class="button-container" style="display: ${item.question_type === "multiple-choice" || item.question_type === "checkbox" ? "block" : "none"}">
                    <button class="option-button" onclick="addOption(this)">Add Option</button>
                    <span>or</span>
                    <button class="option-button-other" onclick="addOtherOption(this)">Add Other</button>
                </div>
            </div>
            <div class="side-buttons">
                <button class="side-button" onclick="addNewQuestion(this)">+</button> <!-- Add question button inside each question container -->
                <button class="side-button" onclick="removeQuestion(this)">x</button>
            </div>
        `;

        questionsContainer.appendChild(questionContainer);
    });
}

// Function to add a new question (below the current one)
function addNewQuestion(button) {
    const questionsContainer = document.getElementById("questionsContainer");

    // Find the container of the clicked "Add Question" button
    const currentQuestionContainer = button.closest(".question-container");

    // Create a new question object (with default values)
    const newQuestion = {
        question_json: {
            question: "New question?",
            options: [],
            scale: []
        },
        question_type: "multiple-choice"
    };

    // Add the new question to the survey data
    staticSurveyData.questions.push(newQuestion);

    // Create a new question container to append below the current one
    const newQuestionContainer = document.createElement("div");
    newQuestionContainer.classList.add("question-container");
    newQuestionContainer.setAttribute("data-id", staticSurveyData.questions.length); // Update the data-id dynamically

    newQuestionContainer.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <input type="text" value="${newQuestion.question_json.question}" placeholder="Question">
                <select onchange="updateQuestionContent(this)">
                    <option value="multiple-choice" ${newQuestion.question_type === "multiple-choice" ? "selected" : ""}>Multiple Choice</option>
                    <option value="checkbox" ${newQuestion.question_type === "checkbox" ? "selected" : ""}>Checkbox</option>
                    <option value="essay" ${newQuestion.question_type === "essay" ? "selected" : ""}>Essay</option>
                    <option value="rating" ${newQuestion.question_type === "rating" ? "selected" : ""}>Rating</option>
                </select>
            </div>
            <div class="options">
                ${newQuestion.question_type === "multiple-choice" || newQuestion.question_type === "checkbox"
        ? "<div class='option-container'><input type='text' placeholder='Option'><button class='remove-button' onclick='removeOption(this)'>Remove</button></div>"
        : newQuestion.question_type === "rating"
            ? `<select class="max-rating-select">${[...Array(10).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join("")}</select>`
            : "<textarea placeholder='Enter an answer here' disabled></textarea>"
    }
            </div>
            <div class="button-container" style="display: ${newQuestion.question_type === "multiple-choice" || newQuestion.question_type === "checkbox" ? "block" : "none"}">
                <button class="option-button" onclick="addOption(this)">Add Option</button>
                <span>or</span>
                <button class="option-button-other" onclick="addOtherOption(this)">Add Other</button>
            </div>
        </div>
        <div class="side-buttons">
            <button class="side-button" onclick="removeQuestion(this)">x</button>
            <button class="side-button" onclick="addNewQuestion(this)">+</button> <!-- Add button for each new question -->
        </div>
    `;

    // Insert the new question container below the current question container
    questionsContainer.insertBefore(newQuestionContainer, currentQuestionContainer.nextSibling);
}

function saveSurveyToJSON() {
    // Collect survey title and description
    const surveyTitle = document.getElementById("formTitle").textContent.trim();
    const surveyDescription = document.getElementById("formDescription").textContent.trim();

    // Collect questions
    const questionContainers = document.querySelectorAll(".question-container");
    const questions = Array.from(questionContainers).map((container) => {
        const questionText = container.querySelector(".question-header input").value.trim();
        const questionType = container.querySelector(".question-header select").value;

        let options = [];
        if (questionType === "multiple-choice" || questionType === "checkbox") {
            const optionInputs = container.querySelectorAll(".options input");
            options = Array.from(optionInputs).map((input) => input.value.trim());
        }

        let scale = [];
        if (questionType === "rating") {
            const scaleSelect = container.querySelector(".max-rating-select");
            if (scaleSelect) {
                const maxScale = parseInt(scaleSelect.value, 10);
                scale = Array.from({ length: maxScale }, (_, i) => i + 1); // Generate scale array
            }
        }

        return {
            question_json: {
                question: questionText,
                options: options,
                scale: scale,
            },
            question_type: questionType,
        };
    });

    // Construct the final JSON object
    const surveyData = {
        survey: {
            survey_title: surveyTitle || "",
            survey_description: surveyDescription || "",
            program_id: "",
            period_start: "",
            period_end: "",
            status: "",
        },
        questions: questions,
        restrict_students: [],
    };

    // Store the JSON in sessionStorage
    sessionStorage.setItem("surveyData", JSON.stringify(surveyData));
    console.log("Survey data saved:", JSON.stringify(surveyData));

    // Redirect to the publish page
    window.location.href = "/admin/surveys/publish";
}

// Attach the save functionality to the Publish button
document.addEventListener("DOMContentLoaded", function () {
    const publishButton = document.querySelector(".publish-button");
    if (publishButton) {
        publishButton.addEventListener("click", saveSurveyToJSON);
    } else {
        console.error("Publish button not found.");
    }
});



function makeEditable(elementId) {
    var element = document.getElementById(elementId);
    if (!element.querySelector('input')) {
        var currentText = element.textContent;
        var input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;

        var computedStyle = window.getComputedStyle(element);
        input.style.width = computedStyle.width;
        input.style.fontSize = computedStyle.fontSize;
        input.style.fontFamily = computedStyle.fontFamily;
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';
        input.style.padding = '8px 10px';
        input.style.boxSizing = 'border-box';

        input.onblur = function() { saveText(elementId, input.value); };

        element.innerHTML = '';
        element.appendChild(input);
        input.focus();
        input.select();
    }
}

function saveText(elementId, text) {
    var element = document.getElementById(elementId);
    element.textContent = text || (elementId === 'formTitle' ? 'Sample Title' : 'Form Description');
}

let questionIndex = 1;

window.onload = function () {
    renderSurvey(staticSurveyData);

    document.querySelector(".publish-button").addEventListener("click", saveSurveyToJSON);

    const addQuestionButton = document.getElementById('addQuestionButton');
    addQuestionButton.addEventListener('click', addQuestion);
}

function addQuestion(event) {
    const button = event.target;
    const questionContainer = button.closest(".question-container");

    // Create a new question container
    const newQuestionContainer = document.createElement("div");
    newQuestionContainer.classList.add("question-container");
    newQuestionContainer.setAttribute("data-id", questionIndex);

    newQuestionContainer.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <input type="text" placeholder="Untitled Question">
                <select onchange="updateQuestionContent(this)">
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="essay">Essay</option>
                    <option value="rating">Rating</option>
                </select>
            </div>
            <div class="options"></div>
            <div class="button-container" style="display: none;">
                <button class="option-button" onclick="addOption(this)">Add Option</button>
                <span>or </span>
                <button class="option-button-other" onclick="addOtherOption(this)">Add Other</button>
            </div>
        </div>
        <div class="side-buttons">
            <button class="side-button" onclick="addQuestion(event)">+</button>
            <button class="side-button" onclick="removeQuestion(this)">x</button>
        </div>
    `;

    // Insert the new container after the current one
    questionContainer.insertAdjacentElement("afterend", newQuestionContainer);

    // Increment question index and reindex questions
    questionIndex++;
    reindexQuestions();
}


function removeQuestion(button) {
    const questionContainer = button.closest(".question-container");

    if (questionContainer) {
        questionContainer.remove();
        reindexQuestions();
    }
}

function reindexQuestions() {
    const questions = document.querySelectorAll(".question-container");
    questionIndex = 1;

    questions.forEach((question) => {
        question.setAttribute("data-id", questionIndex);
        questionIndex++;
    });
}

function updateQuestionContent(selectElement) {
    const questionContent = selectElement.closest(".question-content");
    const optionsContainer = questionContent.querySelector(".options");
    const buttonContainer = questionContent.querySelector(".button-container");
    const questionType = selectElement.value;

    optionsContainer.innerHTML = '';
    buttonContainer.style.display = 'none'; // Default to hide buttons

    switch (questionType) {
        case 'multiple-choice':
        case 'checkbox':
            buttonContainer.style.display = 'block';
            addOption(buttonContainer.querySelector(".option-button"));
            break;

        case 'essay':
            optionsContainer.innerHTML = `<textarea placeholder="Enter an answer here" rows="4" cols="50" disabled class="textarea"></textarea>`;
            break;

        case 'rating':
            const ratingContainer = document.createElement("div");
            ratingContainer.classList.add("rating-container");
            ratingContainer.style.display = "flex";
            ratingContainer.style.gap = "10px";
            ratingContainer.style.marginBottom = "10px";

            const maxRatingSelect = document.createElement("select");
            maxRatingSelect.classList.add("max-rating-select");
            maxRatingSelect.style.marginBottom = "10px";

            for (let i = 1; i <= 10; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                maxRatingSelect.appendChild(option);
            }

            maxRatingSelect.addEventListener("change", () => {
                const maxRating = parseInt(maxRatingSelect.value, 10);
                ratingContainer.innerHTML = "";

                for (let i = 1; i <= maxRating; i++) {
                    const label = document.createElement("label");
                    label.style.display = "flex";
                    label.style.alignItems = "center";

                    const radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = `rating-${selectElement.closest('.question-container').getAttribute('data-id')}`;
                    radio.value = i;
                    radio.style.marginRight = "5px";

                    label.appendChild(radio);
                    label.appendChild(document.createTextNode(i));
                    ratingContainer.appendChild(label);
                }
            });

            optionsContainer.appendChild(maxRatingSelect);
            optionsContainer.appendChild(ratingContainer);
            break;

        default:
            break;
    }
}

function addOption(button) {
    const questionContent = button.closest(".question-content");
    const optionsContainer = questionContent.querySelector(".options");

    const newOption = document.createElement("div");
    newOption.classList.add("option-container");

    newOption.innerHTML = `
        <input type="text" placeholder="Option">
        <button class="remove-button" onclick="removeOption(this)">Remove</button>
    `;

    optionsContainer.appendChild(newOption);
    updateOptionLabels(optionsContainer);
}

function addOtherOption(button) {
    const optionsContainer = button.closest(".question-content").querySelector(".options");
    const otherOption = document.createElement("div");
    otherOption.classList.add("option-container");
    otherOption.innerHTML = `
        <input type="text" placeholder="Other">
        <button class="remove-button" onclick="removeOption(this, false)">Remove</button>
    `;
    optionsContainer.appendChild(otherOption);
}

function removeOption(button) {
    const optionsContainer = button.closest(".options");
    button.parentElement.remove();
    updateOptionLabels(optionsContainer);
}

function updateOptionLabels(optionsContainer) {
    const optionContainers = optionsContainer.querySelectorAll(".option-container");

    optionContainers.forEach((option, index) => {
        const input = option.querySelector("input");
        input.placeholder = `Option ${index + 1}`;
    });
}