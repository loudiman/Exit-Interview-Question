const surveyData = {
    "questions": [
      {
        "question_json": {
          "question": "Which network topology is most resilient to failures?",
          "options": ["Star", "Ring", "Mesh", "Bus"]
        },
        "question_type": "multiple_choice"
      },
      {
        "question_json": {
          "question": "Rate your experience with our services.",
          "options": []
        },
        "question_type": "rating"
      },
      {
        "question_json": {
          "question": "Please provide additional feedback.",
          "options": []
        },
        "question_type": "text_input"
      }
    ]
  };
  
sessionStorage.setItem('questionnaireData', JSON.stringify(surveyData));

document.addEventListener("DOMContentLoaded", function() {
    // Retrieve survey data from sessionStorage
    const storedSurveyData = sessionStorage.getItem('questionnaireData');

    if (storedSurveyData) {
        console.log("Using survey data from sessionStorage");

        // Parse the stored data
        const data = JSON.parse(storedSurveyData);

        // Check if data.questions exists and is an array
        if (data.questions && Array.isArray(data.questions)) {
            // Populate survey questions dynamically based on the stored data
            data.questions.forEach((question, index) => {
                let questionHTML = '';

                switch (question.question_type) {
                    case 'multiple_choice':
                        questionHTML = generateMultipleChoice(question.question_json);
                        break;
                    case 'rating':
                        questionHTML = generateRating(question.question_json);
                        break;
                    case 'text_input':
                        questionHTML = generateTextInput(question.question_json);
                        break;
                    default:
                        console.warn("Unknown question type:", question.question_type);
                        break;
                }

                // Insert the generated question HTML into the corresponding div
                const surveyDiv = document.querySelectorAll('.survey-template')[index];
                if (surveyDiv) {
                    surveyDiv.innerHTML = questionHTML;
                } else {
                    console.error(`Survey div not found for question index: ${index}`);
                }
            });

            // Bind event listeners only after elements are dynamically created
            bindDynamicEventListeners();
        } else {
            console.error("Data does not contain a valid 'questions' array.");
        }
    } else {
        console.error("No survey data found in sessionStorage");
    }
});

function bindDynamicEventListeners() {
    // Handle rating selection with the option to unselect
    document.getElementById("ratingContainer")?.addEventListener("click", function(e) {
        if (e.target.tagName === "IMG") {
            const selectedStar = e.target;
            const allStars = document.querySelectorAll(".rating-item img");

            // Check if the clicked star is already selected
            const isSelected = selectedStar.src.includes("RatingAfter.png");

            // Reset all stars to unselected state if clicking an unselected star
            if (!isSelected) {
                allStars.forEach(star => {
                    star.src = "../resource/images/RatingBefore.png";
                });
                selectedStar.src = "../resource/images/RatingAfter.png"; // Select clicked star
            } else {
                selectedStar.src = "../resource/images/RatingBefore.png"; // Unselect clicked star
            }
        }
    });

    // Handle checklist selection with the option to select multiple and toggle selection
    document.getElementById("checklistContainer")?.addEventListener("click", function(e) {
        if (e.target.classList.contains("checkbox-icon")) {
            const isChecked = e.target.src.includes("Checked_Checkbox.png");

            // Toggle checkbox state: if checked, uncheck it; if unchecked, check it
            e.target.src = isChecked ? "../resource/images/Checkbox.png" : "../resource/images/Checked_Checkbox.png";
        }
    });

    // Clear placeholder on focus in answer input
    document.querySelector(".answer-input")?.addEventListener("focus", function(e) {
        e.target.placeholder = "";
    });

    // Restore placeholder on blur if input is empty
    document.querySelector(".answer-input")?.addEventListener("blur", function(e) {
        if (e.target.value === "") {
            e.target.placeholder = "Your Answer...";
        }
    });

    // Back button functionality
    document.getElementById("backButton")?.addEventListener("click", () => {
        window.history.back();
    });

    // Submit button functionality
    document.getElementById("submitButton")?.addEventListener("click", () => {
        alert("Survey Submitted!");
        window.history.back();
    });
}

// Function to generate HTML for multiple choice questions
function generateMultipleChoice(questionData) {
    // Ensure questionData and questionData.options are defined
    const question = questionData?.question || "Question not available";
    const options = questionData?.options || [];  // Default to empty array if options are missing

    // Create HTML for the multiple-choice question
    let html = `<div class="survey-template">
                  <p class="question-text">${question}</p>
                  <ul class="options-list">`;
    options.forEach(option => {
        html += `<li class="option-item">
                   <input type="radio" name="${question}" value="${option}" class="option-input"> ${option}
                 </li>`;
    });
    html += `</ul></div>`;
    return html;
}


// Function to generate HTML for rating questions
function generateRating(question) {
    let ratingHTML = '';
    for (let i = 1; i <= question.question_json.scale; i++) {
        ratingHTML += `
            <div class="rating-item" data-rating="${i}">
                <span>${i}</span>
                <img src="../resource/images/RatingBefore.png" alt="Star ${i}">
            </div>
        `;
    }

    return `
        <div class="survey-template-header">${question.question_json.question}</div>
        <div class="survey-template-content">
            <div class="rating-container" id="ratingContainer">
                ${ratingHTML}
            </div>
        </div>
    `;
}

// Function to generate HTML for text input questions
function generateTextInput(question) {
    return `
        <div class="survey-template-header">${question.question_json.question}</div>
        <div class="survey-template-content">
            <input type="text" class="answer-input" placeholder="Your Answer...">
        </div>
    `;
}