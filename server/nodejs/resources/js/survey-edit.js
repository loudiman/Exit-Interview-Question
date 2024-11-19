const surveyData = {
    survey_id: 1,
    survey_title: "Sample Survey 1",
    questions: [
        {
            question_id: 1,
            question_json: {
                text: "How satisfied are you with your university experience?",
                options: ["Very satisfied", "Somewhat satisfied", "Neutral", "Somewhat dissatisfied", "Very dissatisfied"]
            },
            question_type: "multiple_choice"
        },
        {
            question_id: 2,
            question_json: {
                text: "What aspects of your studies do you find most satisfying?"
            },
            question_type: "essay"
        },
        {
            question_id: 3,
            question_json: {
                text: "Rate your study-life balance on a scale of 1 to 5.",
                scale: [1, 5]
            },
            question_type: "rating"
        }
    ]
};

// Function to populate survey editing fields dynamically
document.addEventListener("DOMContentLoaded", () => {
    const surveyTitleElement = document.querySelector("#surveyTitle");
    const questionContainer = document.querySelector("#questionContainer");

    // Create a span for the editable title
    const titleText = document.createElement("span");
    titleText.setAttribute("contenteditable", "true");
    titleText.innerText = surveyData.survey_title;
    titleText.addEventListener("input", (e) => {
        surveyData.survey_title = e.target.innerText;
    });

    surveyTitleElement.innerHTML = "";
    surveyTitleElement.appendChild(titleText);

    // Event listener for Add Question Button
    const addQuestionBtn = document.getElementById("addQuestionBtn");
    addQuestionBtn.addEventListener("click", () => {
        const questionType = document.getElementById("questionType").value; // Get selected question type
        const newQuestion = createNewQuestion(questionType);
        surveyData.questions.push(newQuestion);
        renderQuestions(surveyData.questions, questionContainer);
    });

    renderQuestions(surveyData.questions, questionContainer);
});

// Function to create a new question based on selected type
function createNewQuestion(type) {
    const newQuestion = {
        question_id: surveyData.questions.length + 1,
        question_json: {
            text: "New Question",
            options: [],
            scale: [1, 5]
        },
        question_type: type
    };

    // Customize the question based on type
    if (type === "multiple_choice") {
        newQuestion.question_json.options = ["Option 1", "Option 2", "Option 3"];
    } else if (type === "rating") {
        newQuestion.question_json.scale = [1, 5];
    } else if (type === "essay") {
        newQuestion.question_json.text = "Write your answer here...";
    }

    return newQuestion;
}

// Updated renderQuestions function to include 'Add Option' and 'Remove Option' buttons for multiple choice questions
function renderQuestions(questions, container) {
    container.innerHTML = ''; // Clear previous questions

    questions.forEach((question, index) => {
        const questionCard = document.createElement("div");
        questionCard.classList.add("question-card"); // Add a card-like class

        // Question header
        const questionHeader = document.createElement("div");
        questionHeader.classList.add("question-header");

        // Editable Question Text
        const questionText = document.createElement("h3");
        questionText.setAttribute("contenteditable", "true");
        questionText.innerText = question.question_json.text || "Untitled Question";
        questionText.addEventListener("input", (e) => {
            question.question_json.text = e.target.innerText;
        });

        questionHeader.appendChild(questionText);

        // Buttons for actions
        const actionButtons = document.createElement("div");
        actionButtons.classList.add("action-buttons");

        // Remove Question Button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove Question";
        removeBtn.classList.add("btn-remove");
        removeBtn.addEventListener("click", () => {
            surveyData.questions.splice(index, 1); // Remove question from array
            renderQuestions(surveyData.questions, container); // Re-render questions
        });
        actionButtons.appendChild(removeBtn);

        // Change Question Type Dropdown
        const changeTypeDropdown = document.createElement("select");
        changeTypeDropdown.classList.add("change-type");
        ["multiple_choice", "essay", "rating"].forEach((type) => {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type.replace("_", " ").toUpperCase();
            option.selected = question.question_type === type;
            changeTypeDropdown.appendChild(option);
        });

        changeTypeDropdown.addEventListener("change", (e) => {
            question.question_type = e.target.value; // Update question type
            renderQuestions(surveyData.questions, container); // Re-render questions
        });
        actionButtons.appendChild(changeTypeDropdown);

        questionHeader.appendChild(actionButtons);
        questionCard.appendChild(questionHeader);

        // Question Content
        let questionOptions = "";

        if (question.question_type === "multiple_choice") {
            questionOptions = document.createElement("ul");
            questionOptions.classList.add("options-list");

            const options = question.question_json.options || [];

            options.forEach((option, optIndex) => {
                const optionItem = document.createElement("li");

                const inputField = document.createElement("input");
                inputField.type = "text";
                inputField.value = option;
                inputField.addEventListener("change", (event) => {
                    options[optIndex] = event.target.value; // Update option text
                });

                // Create Remove Option Button
                const removeOptionBtn = document.createElement("button");
                removeOptionBtn.textContent = "Remove Option";
                removeOptionBtn.classList.add("btn-remove-option");
                removeOptionBtn.addEventListener("click", () => {
                    options.splice(optIndex, 1); // Remove option from array
                    renderQuestions(surveyData.questions, container); // Re-render to display updated options
                });

                optionItem.appendChild(inputField);
                optionItem.appendChild(removeOptionBtn); // Add remove button beside option
                questionOptions.appendChild(optionItem);
            });

            // Add 'Add Option' Button
            const addOptionBtn = document.createElement("button");
            addOptionBtn.textContent = "Add Option";
            addOptionBtn.classList.add("btn-add-option");
            addOptionBtn.addEventListener("click", () => {
                options.push("New Option");
                renderQuestions(surveyData.questions, container); // Re-render to display new option
            });

            questionOptions.appendChild(addOptionBtn);
        } else if (question.question_type === "rating") {
            const ratingText = document.createElement("p");
            const scale = question.question_json.scale || [1, 5];
            ratingText.textContent = `Rating Scale: ${scale[0]} to ${scale[1]}`;
            questionOptions = ratingText;
        } else if (question.question_type === "essay") {
            const essayTextArea = document.createElement("textarea");
            essayTextArea.rows = 5;
            essayTextArea.cols = 40;
            essayTextArea.value = question.question_json.text;
            essayTextArea.addEventListener("input", (event) => {
                question.question_json.text = event.target.value;
            });
            questionOptions = essayTextArea;
        }

        if (questionOptions) {
            questionCard.appendChild(questionOptions);
        }

        container.appendChild(questionCard);
    });
}
