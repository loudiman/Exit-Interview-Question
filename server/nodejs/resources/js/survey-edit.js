async function saveOldData(){
    try {
        console.log("saving old data")
        console.log(sessionStorage.getItem("surveyData"))
        const oldSurveyData = sessionStorage.getItem("surveyData");
        sessionStorage.setItem("oldSurveyData", oldSurveyData);
    }catch(error){
        console.log(error)
    }
}

// Helper methods for SurveyEditor class

async function makeEditable(elementId) {
    const element = document.getElementById(elementId);
    if (!element.querySelector('input')) {
        const currentText = element.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;

        const computedStyle = window.getComputedStyle(element);
        input.style.width = computedStyle.width;
        input.style.fontSize = computedStyle.fontSize;
        input.style.fontFamily = computedStyle.fontFamily;
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';
        input.style.padding = '8px 10px';
        input.style.boxSizing = 'border-box';

        input.onblur = () => {
            this.saveText(elementId, input.value);
        };

        element.innerHTML = '';
        element.appendChild(input);
        input.focus();
        input.select();
    }
}

async function saveText(elementId, text) {
    const element = document.getElementById(elementId);
    element.textContent = text || (elementId === 'formTitle' ? 'Untitled Survey' : 'Survey Description');
}


async function addNewQuestion(button) {
    const questionsContainer = document.getElementById("questionsContainer");
    const currentQuestionContainer = button.closest(".question-container");

    const newQuestion = {
        question_json: {
            question: "New Question?",
            options: [],
            scale: []
        },
        question_type: "multiple_choice"
    };

    // Add the new question to the survey data if it exists
    if (this.surveyData && this.surveyData.questions) {
        this.surveyData.questions.push(newQuestion);
    }

    // Create a new question container
    const newQuestionContainer = this.createQuestionElement(newQuestion, this.surveyData ? this.surveyData.questions.length - 1 : 0);

    // Insert the new question container below the current one
    questionsContainer.insertBefore(newQuestionContainer, currentQuestionContainer.nextSibling);

    // Reindex questions to ensure consistent data-id attributes
    this.reindexQuestions();
}

async function removeQuestion(button) {
    const questionContainer = button.closest(".question-container");
    const dataId = parseInt(questionContainer.getAttribute('data-id')) - 1;

    if (questionContainer) {
        questionContainer.remove();

        // Remove the question from surveyData if it exists
        if (this.surveyData && this.surveyData.questions) {
            this.surveyData.questions.splice(dataId, 1);
        }

        this.reindexQuestions();
    }
}

async function reindexQuestions() {
    const questions = document.querySelectorAll(".question-container");
    let questionIndex = 1;

    questions.forEach((question) => {
        question.setAttribute("data-id", questionIndex);
        questionIndex++;
    });
}

async function updateQuestionContent(selectElement) {
    const questionContent = selectElement.closest(".question-content");
    const optionsContainer = questionContent.querySelector(".options");
    const buttonContainer = questionContent.querySelector(".button-container");
    const questionType = selectElement.value;

    // Reset options container
    optionsContainer.innerHTML = '';
    buttonContainer.style.display = 'none';

    switch (questionType) {
        case 'multiple_choice':
        case 'checkbox':
            updateMultipleChoiceAndCheckbox(buttonContainer, optionsContainer);
            break;

        case 'essay':
            updateEssay(optionsContainer);
            break;

        case 'rating':
        updateRating(optionsContainer,selectElement);
            break;

        default:
            break;
    }

    // Update the question type in surveyData if it exists
    const questionContainer = selectElement.closest(".question-container");
    const dataId = parseInt(questionContainer.getAttribute('data-id')) - 1;

    if (this.surveyData && this.surveyData.questions && this.surveyData.questions[dataId]) {
        this.surveyData.questions[dataId].question_type = questionType;
    }
}

function updateMultipleChoiceAndCheckbox (buttonContainer,optionsContainer) {
    buttonContainer.style.display = 'block';
    this.addOption(optionsContainer);
}

function updateEssay (optionsContainer){
    optionsContainer.innerHTML = `
            <textarea placeholder="Enter an answer here" rows="4" cols="50" disabled class="textarea">
            </textarea>
        `;
}

function updateRating(optionsContainer, selectElement) {
    const ratingContainer = createRatingContainer();
    const maxRatingSelect = createMaxRatingSelect();

    maxRatingSelect.addEventListener("change", () => {
        const maxRating = parseInt(maxRatingSelect.value, 10);
        generateRadioButtons(maxRating, selectElement, ratingContainer);
    });

    optionsContainer.appendChild(maxRatingSelect);
    optionsContainer.appendChild(ratingContainer);
}


function createRatingContainer() {
    const ratingContainer = document.createElement("div");
    ratingContainer.classList.add("rating-container");
    return ratingContainer;
}

function createMaxRatingSelect() {
    const maxRatingSelect = document.createElement("select");
    maxRatingSelect.classList.add("max-rating-select");

    for (let i = 1; i <= 10; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        maxRatingSelect.appendChild(option);
    }

    return maxRatingSelect;
}

function generateRadioButtons(maxRating, selectElement, ratingContainer) {
    ratingContainer.innerHTML = ""; // Clear previous radio buttons

    for (let i = 1; i <= maxRating; i++) {
        const label = document.createElement("label");

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `rating-${selectElement.closest('.question-container').getAttribute('data-id')}`;
        radio.value = i;

        label.appendChild(radio);
        label.appendChild(document.createTextNode(i));
        ratingContainer.appendChild(label);
    }
}




async function addOption(button) {
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

async function addOtherOption(button) {
    const optionsContainer = button.closest(".question-content").querySelector(".options");
    const otherOption = document.createElement("div");
    otherOption.classList.add("option-container");
    otherOption.innerHTML = `
    <input type="text" value="Other" placeholder="Other">
    <button class="remove-button" onclick="removeOption(this)">Remove</button>
`;
    optionsContainer.appendChild(otherOption);
    this.updateOptionLabels(optionsContainer);

    // Update options in surveyData if it exists
    const questionContainer = button.closest(".question-container");
    const dataId = parseInt(questionContainer.getAttribute('data-id')) - 1;

    if (this.surveyData && this.surveyData.questions && this.surveyData.questions[dataId]) {
        const currentQuestion = this.surveyData.questions[dataId];
        if (!currentQuestion.question_json.options) {
            currentQuestion.question_json.options = [];
        }
        currentQuestion.question_json.options.push('Other');
    }
}

async function removeOption(button) {
    const optionsContainer = button.closest(".options");
    const optionToRemove = button.parentElement;
    const optionText = optionToRemove.querySelector('input').value;

    // Remove the option from the DOM
    optionToRemove.remove();
    this.updateOptionLabels(optionsContainer);

    // Remove the option from surveyData if it exists
    const questionContainer = button.closest(".question-container");
    const dataId = parseInt(questionContainer.getAttribute('data-id')) - 1;

    if (this.surveyData && this.surveyData.questions && this.surveyData.questions[dataId]) {
        const currentQuestion = this.surveyData.questions[dataId];
        if (currentQuestion.question_json.options) {
            currentQuestion.question_json.options = currentQuestion.question_json.options.filter(opt => opt !== optionText);
        }
    }
}

async function updateOptionLabels(optionsContainer) {
    const optionContainers = optionsContainer.querySelectorAll(".option-container");

    optionContainers.forEach((option, index) => {
        const input = option.querySelector("input");
        input.placeholder = `Option ${index + 1}`;
    });
}

async function updateScale(selectElement, questionIndex) {
    const scaleValue = parseInt(selectElement.value, 10);  // Get the selected scale size

    // Get the container where we will render the radio buttons
    const ratingContainer = document.getElementById(`rating-scale-${questionIndex}`);
    ratingContainer.innerHTML = "";  // Clear any existing radio buttons

    // Render radio buttons dynamically based on the scale value
    for (let i = 1; i <= scaleValue; i++) {
        const label = document.createElement("label");
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.justifyContent = "center";  // Center the radio button and number horizontally
        label.style.marginRight = "40px";  // Add some spacing between radio buttons

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `rating-${questionIndex}`;
        radio.value = i;
        radio.style.width = "18px";  // Set radio button width
        radio.style.height = "18px"; // Set radio button height
        radio.style.marginRight = "5px"; // Add space between the radio button and number
        radio.style.marginLeft = "5px";  // Ensure consistent spacing

        label.appendChild(radio);
        label.appendChild(document.createTextNode(i));  // Add the number next to the radio button
        ratingContainer.appendChild(label);
    }

    // Update the question data (if needed)
    if (this.surveyData && this.surveyData.questions && this.surveyData.questions[questionIndex]) {
        this.surveyData.questions[questionIndex].question_json.scale = Array.from({ length: scaleValue }, (_, i) => i + 1);
    }
}

function renderOptions(type, options, scale, index) {
    switch (type) {
        case "multiple_choice":
        case "checkbox":
            return options.map((opt, i) => `
            <div class="option-container">
                <input type="text" value="${opt}" placeholder="Option ${i + 1}">
                <button class="remove-button" onclick="removeOption(this)">Remove</button>
            </div>
        `).join("");
        case "rating":
            const maxScaleValue = 10;  // Fixed max scale value of 10
            const selectedScale = scale ? scale : 5;  // Default to 5 if no scale is provided
            return `
    <select class="max-rating-select" onchange="updateScale(this, ${index})">
        ${Array.from({ length: maxScaleValue }, (_, i) => `
            <option value="${i + 1}" ${selectedScale === (i + 1) ? "selected" : ""}>${i + 1}</option>
        `).join("")}
    </select>
    <div class="rating-scale" id="rating-scale-${index}">
        <!-- Dynamic radio buttons will be added here -->
    </div>
`;
        case "essay":
            return `<textarea placeholder="Enter your answer here" disabled></textarea>`;
        default:
            return "";
    }
}


async function fetchSurveyDetails(survey_ID){
    const url = `http://localhost:2020/api/survey-service/survey-summary?survey_id=${survey_ID}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const surveyDetails = await response.json();
        console.log(surveyDetails)
        return surveyDetails;
    }
    catch (error) {
        console.error('Failed to fetch survey details:', error.message);
        return {};
    }
}

async function fetchSurveyQuestions(surveyID) {
    try {
        this.surveyData = await fetch(`http://localhost:2020/api/survey-service/questions/${surveyID}`);
        if (!this.surveyData.ok) {
            throw new Error(`HTTP error! Status: ${this.surveyData.status}`);
        }

        const data = await this.surveyData.json();
        if (data.questions) {
            data.questions = data.questions.map(question => {
                try {
                    const parsedJson = JSON.parse(question.question_json);
                    console.log("Parsed question:", parsedJson);

                    return {
                        ...question,
                        question_json: parsedJson || {}, // Ensure valid object
                    };
                } catch (e) {
                    console.error('Error parsing question_json:', question.question_json, e);
                    return {
                        ...question,
                        question_json: {}, // Fallback to default
                    };
                }
            });

            this.surveyData = data
            console.log("rendering")
            renderSurvey(data);
            console.log('Survey questions fetched and parsed:', data);
        } else {
            console.error('No questions found in the this.surveyData');
        }
    } catch (error) {
        console.error('Error fetching or parsing survey questions:', error);
    }
}

function renderSurvey(data) {
    const questionsContainer = document.getElementById("questionsContainer");
    questionsContainer.innerHTML = ""; // Clear existing questions

    data.questions.forEach((item, index) => {
        const questionContainer = createQuestionElement(item, index);
        questionsContainer.appendChild(questionContainer);
    });

    reindexQuestions();
}

function createQuestionElement(item, index) {
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");
    questionContainer.setAttribute("data-id", index + 1);

    const { question, options = [], scale = []} = item.question_json || {};

    console.log("Options:", options);

    questionContainer.innerHTML = `
    <div class="question-content">
        <div class="question-header">
            <input type="text" value="${question}" placeholder="Question">
            <select onchange="updateQuestionContent(this)">
                <option value="multiple_choice" ${item.question_type === "multiple_choice" ? "selected": ""}>Multiple Choice</option>
                <option value="checkbox" ${item.question_type === "checkbox" ? "selected" : ""}>Checkbox</option>
                <option value="essay" ${item.question_type === "essay" ? "selected" : ""}>Essay</option>
                <option value="rating" ${item.question_type === "rating" ? "selected" : ""}>Rating</option>
            </select>
        </div>
        <div class="options">
            ${renderOptions(item.question_type, options, scale, index)}
        </div>
       
         
        <div class="button-container" style="display: ${["multiple_choice", "checkbox"].includes(item.question_type) ? "block" : "none"};">
            <button class="option-button" onclick="addOption(this)">Add Option</button>
            <span>or</span>
            <button class="option-button-other" onclick="addOtherOption(this)">Add Other</button>
        </div>
    </div>
    <div class="side-buttons">
        <button class="side-button" onclick="addNewQuestion(this)">+</button>
        <button class="side-button" onclick="removeQuestion(this)">x</button>
    </div>
`;
    return questionContainer;
}

function attachEventListeners() {
    // Attach save functionality to Publish button
    const publishButton = document.querySelector(".publish-button");
    if (publishButton) {
        publishButton.addEventListener("click", () => this.saveSurveyToJSON());
    }


    // Make title and description editable
    document.getElementById('formTitle').addEventListener('click', () => this.makeEditable('formTitle'));
    document.getElementById('formDescription').addEventListener('click', () => this.makeEditable('formDescription'));
}

function saveSurveyToJSON() {
    const urlParams = new URLSearchParams(window.location.search);
    const surveyID = urlParams.get('survey_id')
    // Step 5: Generate JSON and store in sessionStorage
    const surveyTitle = document.getElementById("formTitle").textContent.trim();
    const surveyDescription = document.getElementById("formDescription").textContent.trim();

    const questionContainers = document.querySelectorAll(".question-container");
    const questions = Array.from(questionContainers).map((container, index) => {
        const questionText = container.querySelector(".question-header input").value.trim();
        const questionType = container.querySelector(".question-header select").value;

        let options = [];
        let scale = [];

        switch (questionType) {
            case "multiple_choice":
            case "checkbox":
                options = Array.from(container.querySelectorAll(".options input")).map(input => input.value.trim());
                break;
            case "rating":
                const scaleSelect = container.querySelector(".max-rating-select");
                if (scaleSelect) {
                    const maxScale = parseInt(scaleSelect.value, 10);
                    scale = Array.from({ length: maxScale }, (_, i) => i + 1);
                }
                break;
        }

        // Get question ID from this.surveyData
        const questionId = this.surveyData?.questions?.[index]?.question_id;

        return {
            question_id: questionId,
            question_json: {
                question: questionText,
                options: options,
                scale: scale,
            },
            question_type: questionType,
        };
    });

    const surveyData = {
        survey: {
            survey_title: surveyTitle || "Untitled Survey",
            survey_description: surveyDescription || "",
            survey_id: surveyID,
            program_id: "",
            period_start: "",
            period_end: "",
            status: "Draft"
        },
        questions: questions,
        restrict_students: []
    };

    // Store the JSON in sessionStorage
    sessionStorage.setItem("surveyData", JSON.stringify(surveyData));
    console.log("Survey data saved:", JSON.stringify(surveyData));

    // Redirect to publish page
    window.location.href = "/admin/surveys/publish";
}

function saveCurrentSurvey() {
    const urlParams = new URLSearchParams(window.location.search);
    const surveyID = urlParams.get('survey_id')
    // Step 5: Generate JSON and store in sessionStorage
    const surveyTitle = document.getElementById("formTitle").textContent.trim();
    const surveyDescription = document.getElementById("formDescription").textContent.trim();

    const questionContainers = document.querySelectorAll(".question-container");
    const questions = Array.from(questionContainers).map((container, index) => {
        const questionText = container.querySelector(".question-header input").value.trim();
        const questionType = container.querySelector(".question-header select").value;

        let options = [];
        let scale = [];

        switch (questionType) {
            case "multiple_choice":
            case "checkbox":
                options = Array.from(container.querySelectorAll(".options input")).map(input => input.value.trim());
                break;
            case "rating":
                const scaleSelect = container.querySelector(".max-rating-select");
                if (scaleSelect) {
                    const maxScale = parseInt(scaleSelect.value, 10);
                    scale = Array.from({ length: maxScale }, (_, i) => i + 1);
                }
                break;
        }

        // Get question ID from this.surveyData
        const questionId = this.surveyData?.questions?.[index]?.question_id;

        return {
            question_id: questionId,
            question_json: {
                question: questionText,
                options: options,
                scale: scale,
            },
            question_type: questionType,
        };
    });

    const surveyData = {
        survey: {
            survey_title: surveyTitle || "Untitled Survey",
            survey_description: surveyDescription || "",
            survey_id: surveyID,
            program_id: "",
            period_start: "",
            period_end: "",
            status: "Draft"
        },
        questions: questions,
        restrict_students: []
    };

    // Store the JSON in sessionStorage
    sessionStorage.setItem("surveyData", JSON.stringify(surveyData));
    console.log("Survey data saved:", JSON.stringify(surveyData));
}

class SurveyEditor {
    constructor() {
        this.surveyData = null;
        this.surveyId = null;
        this.initializePage();
    }

    async initializePage() {
        // Extract Survey ID from URL
        const urlParams = new URLSearchParams(window.location.search);

        // Retrieve Survey Details from sessionStorage
        const surveyDetails = await fetchSurveyDetails(urlParams.get('survey_id'));
        this.surveyId = urlParams.get('survey_id');
        // sessionStorage.setItem('surveyDetails', getSurveyDetails);
        // const storedSurveyDetails = sessionStorage.getItem('surveyDetails');
        console.log('Stored survey details:', surveyDetails);
        document.getElementById('formTitle').textContent = surveyDetails.survey_title || 'Untitled Survey';
        document.getElementById('formDescription').textContent = surveyDetails.survey_description || 'No description';
        if (surveyDetails) {
            // console.log('Survey details:', surveyDetails);
            // const parsedDetails = JSON.parse(surveyDetails);
            // console.log('Parsed survey details:', parsedDetails);
            var [surveyDetailsJson ] = surveyDetails
            document.getElementById('formTitle').textContent = surveyDetailsJson.survey_title || 'Untitled Survey';
            document.getElementById('formDescription').textContent = surveyDetailsJson.survey_description || 'No description';
        }        

        // Step 3: Fetch Associated Questions
        await fetchSurveyQuestions(urlParams.get('survey_id'));

        // Attach event listeners
        attachEventListeners();

        saveCurrentSurvey(this.surveyId);
        saveOldData(this.surveyId);
    }
}

// Initialize the survey editor
const surveyEditor = new SurveyEditor();

// To ensure compatibility with existing event handlers
window.surveyEditor = surveyEditor;