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

window.onload = function() {
    const addQuestionButton = document.getElementById('addQuestionButton');
    addQuestionButton.addEventListener('click', addQuestion);

    const firstSelectElement = document.querySelector('select');
    updateQuestionContent(firstSelectElement);
}

function addQuestion(event) {
    const button = event.target;
    const questionContainer = button.closest(".question-container");
    const questionsContainer = document.getElementById("questionsContainer");

    const newQuestionContainer = document.createElement("div");
    newQuestionContainer.classList.add("question-container");
    newQuestionContainer.setAttribute("data-id", questionIndex);

    newQuestionContainer.innerHTML = `
        <div class="question-content">
          <div class="question-header">
            <input type="text" placeholder="Untitled Question">
            <select onchange="updateQuestionContent(this)">
              <option value="multiple-choice">Multiple Choice</option>
              <option value="essay">Essay</option>
              <option value="rating">Rating</option>
              <option value="true-false">True or False</option>
            </select>
          </div>
          <div class="options"></div>
          <div class="button-container" style="display: none;">
            <button class="option-button" onclick="addOption(this)">Add Option</button>
            <span>or</span>
            <button class="option-button" onclick="addOtherOption(this)">Add Other</button>
          </div>
        </div>
        <div class="side-buttons">
          <button class="side-button" id="addQuestionButton">+</button>
          <button class="side-button" onclick="removeQuestion(this)">x</button>
        </div>
    `;

    questionContainer.insertAdjacentElement("afterend", newQuestionContainer);
    questionIndex++;

    const newAddButton = newQuestionContainer.querySelector('.side-button');
    newAddButton.addEventListener('click', addQuestion);

    const newSelectElement = newQuestionContainer.querySelector('select');
    updateQuestionContent(newSelectElement);
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

    questions.forEach((question, index) => {
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
    buttonContainer.style.display = questionType === 'multiple-choice' ? 'block' : 'none';

    if (questionType === 'multiple-choice') {
        addOption(buttonContainer.querySelector(".option-button"));
    } else if (questionType === 'essay') {
        optionsContainer.innerHTML = `<textarea placeholder="Your answer here..." rows="4" cols="50" disabled></textarea>`;
    } else if (questionType === 'rating') {
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
                radio.name = "rating";
                radio.value = i;
                radio.style.marginRight = "5px";
                radio.disabled = true;

                label.appendChild(radio);
                label.appendChild(document.createTextNode(i));
                ratingContainer.appendChild(label);
            }
        });

        optionsContainer.appendChild(maxRatingSelect);
        optionsContainer.appendChild(ratingContainer);
    } else if (questionType === 'true-false') {
        optionsContainer.innerHTML = `
          <div>
            <input type="radio" name="trueFalse" value="true" disabled> True
            <input type="radio" name="trueFalse" value="false" disabled> False
          </div>
        `;
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
