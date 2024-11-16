const surveyData = {
    survey_id: 1,
    survey_title: "Employee Satisfaction Survey",
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

// Sample function to simulate fetching survey data
function fetchSurveyData(surveyId) {
    return new Promise((resolve, reject) => {
        if (surveyId === surveyData.survey_id) {
            resolve(surveyData);
        } else {
            reject("Survey not found");
        }
    });
}

// Function to populate survey editing fields dynamically
document.addEventListener("DOMContentLoaded", () => {
    const surveyId = new URLSearchParams(window.location.search).get("surveyId");
    const surveyTitleElement = document.querySelector("#surveyTitle");
    const questionContainer = document.querySelector(".survey-edit");

    if (!surveyId) {
        surveyTitleElement.innerText = "Error: No survey ID provided.";
        return;
    }

    fetchSurveyData(surveyId)
        .then((data) => {
            surveyTitleElement.innerText = `Editing Survey: ${data.survey_title}`;
            renderQuestions(data.questions, questionContainer);
        })
        .catch((err) => {
            console.error(err);
            surveyTitleElement.innerText = "Error loading survey data.";
        });
});

// Function to render questions dynamically
function renderQuestions(questions, container) {
    questions.forEach((question) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question-item");

        let questionHTML = `<h3>${question.question_json.text}</h3>`;
        if (question.question_type === "multiple_choice") {
            questionHTML += `<ul>${question.question_json.options
                .map((option) => `<li>${option}</li>`)
                .join("")}</ul>`;
        } else if (question.question_type === "rating") {
            questionHTML += `<p>Rating Scale: ${question.question_json.scale[0]} to ${question.question_json.scale[1]}</p>`;
        }

        questionDiv.innerHTML = questionHTML;
        container.appendChild(questionDiv);
    });
}
