// JavaScript for handling admin-view-questions and inserting questions dynamically

document.addEventListener("DOMContentLoaded", () => {
    // Initialize event listeners
    const backButton = document.getElementById("back_button");
    const sidebar = document.getElementById("sidebar");
    const form = document.getElementById("form");

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

    // Form submission event listener for adding a question
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const questionTypeInput = document.querySelector("#question_type");
            const questionJSONInput = document.querySelector("#question_json");

            if (questionTypeInput && questionJSONInput) {
                const question = {
                    question_type: questionTypeInput.value,
                    question_json: questionJSONInput.value
                };

                try {
                    const questionId = await insertQuestion(question);
                    alert(`Question added successfully! Question ID: ${questionId}`);
                } catch (error) {
                    console.error("Error adding question:", error);
                    alert("Failed to add the question. Please try again later.");
                }
            } else {
                alert("Please fill in all required fields.");
            }
        });
    }
});

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