let questionIndex = 1;

// Example survey JSON data
const surveyData = {
    "survey_id": 1,
    "survey_title": "CS Department Evaluation 2024",
    "questions": [
        {
            "question_id": 1,
            "question_text": "How satisfied are you with the course curriculum?",
            "question_type": "multiple_choice",
            "options": [
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree"
            ],
            "scale": null
        },
        {
            "question_id": 2,
            "question_text": "Please provide additional feedback about the course.",
            "question_type": "essay",
            "options": [],
            "scale": null
        },
        {
            "question_id": 3,
            "question_text": "Rate the quality of teaching",
            "question_type": "rating",
            "options": null,
            "scale": 5
        }
    ]
};

// Fetch survey data from the server/API
function fetchSurveyData() {
    return fetch('/path/to/your/api')  // Replace with your API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch from server');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching survey data from server:', error);
            return null;
        });
}

// Initialize the survey rendering process
function initializeSurvey() {
    const questionsContainer = document.getElementById('questionsContainer');

    fetchSurveyData().then(data => {
        if (data && data.survey_title) {
            renderSurvey(data);
        } else {
            console.log('Using fallback data from local JSON');
            renderSurvey(surveyData);
        }
    });
}

// Function to render the survey
function renderSurvey(surveyData) {
    const formTitle = document.getElementById('formTitle');
    const questionsContainer = document.getElementById('questionsContainer');

    questionsContainer.innerHTML = '';
    formTitle.textContent = surveyData.survey_title;

    surveyData.questions.forEach(questionData => {
        addQuestionFromData(questionData, questionsContainer);
    });
}

// Create a new question container
function createQuestionContainer(questionData) {
    const newQuestionContainer = document.createElement("div");
    newQuestionContainer.classList.add("question-container");
    newQuestionContainer.setAttribute("data-question-id", questionData.question_id || questionIndex);

    newQuestionContainer.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <input type="text" class="question-text" value="${questionData.question_text}" onchange="updateQuestionText(this)">
                <select class="question-type" onchange="changeQuestionType(this)">
                    <option value="multiple_choice" ${questionData.question_type === 'multiple_choice' ? 'selected' : ''}>Multiple Choice</option>
                    <option value="essay" ${questionData.question_type === 'essay' ? 'selected' : ''}>Essay</option>
                    <option value="rating" ${questionData.question_type === 'rating' ? 'selected' : ''}>Rating</option>
                </select>
            </div>
            <div class="options"></div>
            <div class="button-container" style="display: ${questionData.question_type === 'multiple_choice' ? 'block' : 'none'};">
                <button class="option-button" onclick="addOption(this)">Add Option</button>
                <span>or</span>
                <button class="option-button" onclick="addOtherOption(this)">Add Other</button>
            </div>
        </div>
        <div class="side-buttons">
            <button class="side-button add-question-btn" onclick="addNewQuestion(this)">+</button>
            <button class="side-button remove-question-btn" onclick="removeQuestion(this)">x</button>
        </div>
    `;

    return newQuestionContainer;
}

// Add question to DOM
function addQuestionFromData(questionData, container) {
    const newQuestionContainer = createQuestionContainer(questionData);

    switch(questionData.question_type) {
        case 'multiple_choice':
            renderMultipleChoiceOptions(newQuestionContainer, questionData.options);
            break;
        case 'essay':
            renderEssayQuestion(newQuestionContainer);
            break;
        case 'rating':
            renderRatingQuestion(newQuestionContainer, questionData.scale);
            break;
    }

    container.appendChild(newQuestionContainer);
    questionIndex++;
}

// Render multiple choice options
function renderMultipleChoiceOptions(questionContainer, options = []) {
    const optionsContainer = questionContainer.querySelector('.options');
    optionsContainer.innerHTML = '';

    if (options.length === 0) {
        addOptionToQuestion(questionContainer);
    } else {
        options.forEach(option => {
            addOptionToQuestion(questionContainer, option);
        });
    }
}

// Render essay question
function renderEssayQuestion(questionContainer) {
    const optionsContainer = questionContainer.querySelector('.options');
    const buttonContainer = questionContainer.querySelector('.button-container');

    optionsContainer.innerHTML = `<textarea placeholder="Enter an answer here" rows="4" cols="50" disabled class="textarea"></textarea>`;
    buttonContainer.style.display = 'none';
}

// Render rating question
function renderRatingQuestion(questionContainer, scale = 5) {
    const optionsContainer = questionContainer.querySelector('.options');
    const buttonContainer = questionContainer.querySelector('.button-container');

    optionsContainer.innerHTML = `
        <select class="max-rating-select" onchange="updateRatingScale(this)">
            ${[...Array(10)].map((_, i) =>
        `<option value="${i+1}" ${i+1 === scale ? 'selected' : ''}>${i+1}</option>`
    ).join('')}
        </select>
        <div class="rating-container">
            ${[...Array(scale)].map((_, i) =>
        `<label>
                    <input type="radio" name="rating" value="${i+1}">
                    ${i+1}
                </label>`
    ).join('')}
        </div>
    `;
    buttonContainer.style.display = 'none';
}

// Change question type handler
function changeQuestionType(selectElement) {
    const questionContainer = selectElement.closest('.question-container');
    const newType = selectElement.value;
    const optionsContainer = questionContainer.querySelector('.options');
    const buttonContainer = questionContainer.querySelector('.button-container');

    switch(newType) {
        case 'multiple_choice':
            buttonContainer.style.display = 'block';
            renderMultipleChoiceOptions(questionContainer);
            break;
        case 'essay':
            renderEssayQuestion(questionContainer);
            break;
        case 'rating':
            renderRatingQuestion(questionContainer);
            break;
    }
}

// Add option to multiple choice question
function addOptionToQuestion(questionContainer, optionText = '') {
    const optionsContainer = questionContainer.querySelector('.options');
    const optionElement = document.createElement('div');
    optionElement.classList.add('option-container');

    optionElement.innerHTML = `
        <input type="text" class="option-input" value="${optionText}" onchange="updateOptionText(this)">
        <button class="remove-button" onclick="removeOption(this)">Remove</button>
    `;
    optionsContainer.appendChild(optionElement);
}

// Add option button handler
function addOption(buttonElement) {
    const questionContainer = buttonElement.closest('.question-container');
    addOptionToQuestion(questionContainer);
}

// Add "Other" option handler
function addOtherOption(buttonElement) {
    const questionContainer = buttonElement.closest('.question-container');
    addOptionToQuestion(questionContainer, 'Other');
}

// Remove option
function removeOption(removeButton) {
    const optionContainer = removeButton.closest('.option-container');
    optionContainer.remove();
}

// Remove question
function removeQuestion(removeButton) {
    const questionContainer = removeButton.closest('.question-container');
    const questionsContainer = document.getElementById('questionsContainer');
    if (questionsContainer.children.length > 1) {
        questionContainer.remove();
    } else {
        alert('You must have at least one question.');
    }
}

// Add new question
function addNewQuestion(addButton) {
    const questionsContainer = document.getElementById('questionsContainer');
    const newQuestionData = {
        question_id: questionIndex,
        question_text: 'Untitled Question',
        question_type: 'multiple_choice',
        options: ['Option 1']
    };

    const newQuestionContainer = createQuestionContainer(newQuestionData);
    const questionContainer = addButton.closest('.question-container');
    questionContainer.insertAdjacentElement('afterend', newQuestionContainer);

    renderMultipleChoiceOptions(newQuestionContainer, newQuestionData.options);
    questionIndex++;
}

// Update question text
function updateQuestionText(inputElement) {
    console.log('Question text updated:', inputElement.value);
}

// Update option text
function updateOptionText(inputElement) {
    console.log('Option text updated:', inputElement.value);
}

// Update rating scale
function updateRatingScale(selectElement) {
    const questionContainer = selectElement.closest('.question-container');
    const newScale = parseInt(selectElement.value, 10);
    renderRatingQuestion(questionContainer, newScale);
}

// Collect survey data from DOM
function collectSurveyData() {
    const surveyData = {
        survey_title: document.getElementById('formTitle').textContent,
        questions: []
    };

    const questionContainers = document.querySelectorAll('.question-container');
    questionContainers.forEach((container, index) => {
        const questionData = {
            question_id: index + 1,
            question_text: container.querySelector('.question-text').value,
            question_type: container.querySelector('.question-type').value,
            options: [],
            scale: null
        };

        switch (questionData.question_type) {
            case 'multiple_choice':
                questionData.options = Array.from(container.querySelectorAll('.option-input')).map(input => input.value);
                break;
            case 'rating':
                questionData.scale = parseInt(container.querySelector('.max-rating-select').value, 10);
                break;
        }

        surveyData.questions.push(questionData);
    });

    return surveyData;
}

// Save survey data (example)
function saveSurveyData() {
    const data = collectSurveyData();
    console.log('Survey data:', JSON.stringify(data));

    // Example: Save to API
    fetch('/path/to/your/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log('Survey saved:', result);
        })
        .catch(error => {
            console.error('Error saving survey:', error);
        });
}

// Initialize the survey when the page loads
window.onload = initializeSurvey;