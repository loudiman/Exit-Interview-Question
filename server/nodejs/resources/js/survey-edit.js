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

// Updated renderQuestions function to include 'Add Option' button for multiple choice questions
function renderQuestions(questions, container) {
    container.innerHTML = ''; // Clear previous questions

    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question-item");

        const questionText = document.createElement("h3");
        questionText.setAttribute("contenteditable", "true");
        questionText.innerText = question.question_json.text || "Untitled Question";
        questionText.addEventListener("input", (e) => {
            question.question_json.text = e.target.innerText;
        });

        questionDiv.appendChild(questionText);

        let questionOptions = "";

        if (question.question_type === "multiple_choice") {
            questionOptions = document.createElement("ul");
            const options = question.question_json.options || [];

            options.forEach((option, optIndex) => {
                const optionItem = document.createElement("li");

                const inputField = document.createElement("input");
                inputField.type = "text";
                inputField.value = option;
                inputField.addEventListener('change', (event) => {
                    options[optIndex] = event.target.value;
                });

                optionItem.appendChild(inputField);
                questionOptions.appendChild(optionItem);
            });

            // Add 'Add Option' button for multiple choice questions
            const addOptionBtn = document.createElement("button");
            addOptionBtn.textContent = "Add Option";
            addOptionBtn.addEventListener("click", () => {
                options.push("New Option");
                renderQuestions(surveyData.questions, container); // Re-render questions to show new option
            });

            questionOptions.appendChild(addOptionBtn);

        } else if (question.question_type === "rating") {
            const ratingText = document.createElement("p");
            const scale = question.question_json.scale || [1, 5];
            const ratingInput = document.createElement("input");
            ratingInput.type = "number";
            ratingInput.min = scale[0];
            ratingInput.max = scale[1];
            ratingInput.value = scale[0];

            ratingInput.addEventListener('change', (event) => {
                question.question_json.scale[0] = event.target.value;
            });

            ratingText.innerText = `Rating Scale: `;
            ratingText.appendChild(ratingInput);
            questionOptions = ratingText;

        } else if (question.question_type === "essay") {
            const essayTextArea = document.createElement("textarea");
            essayTextArea.rows = 5;
            essayTextArea.cols = 40;
            essayTextArea.addEventListener('input', (event) => {
                question.question_json.text = event.target.value;
            });
            questionOptions = essayTextArea;
        }

        questionDiv.appendChild(questionOptions);

        // Add Remove Button for the Question
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove Question";
        removeBtn.addEventListener("click", () => {
            surveyData.questions.splice(index, 1); // Remove question from array
            renderQuestions(surveyData.questions, container); // Re-render questions
        });

        questionDiv.appendChild(removeBtn);

        container.appendChild(questionDiv);
    });
}