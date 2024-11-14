
import SurveyCreationDataManipulation from "survey-creation-data-manipulation";

class SurveyCreationUI {
    constructor() {
        this.dataManipulation = new SurveyCreationDataManipulation(); // Connect to data manipulation class
    }

    // Handle adding a new question
    async addNewQuestion(questionJson, questionType) {
        try {
            const questionId = await this.dataManipulation.addQuestion(questionJson, questionType);
            console.log('Question added with ID:', questionId);
            this.updateQuestionList(); // Refresh question list after adding
        } catch (err) {
            console.error('Error adding question:', err);
        }
    }

    // Handle adding a new survey
    async addNewSurvey(surveyStatus, programFilter) {
        try {
            const surveyId = await this.dataManipulation.addSurvey(surveyStatus, programFilter);
            console.log('Survey added with ID:', surveyId);
            this.updateSurveyList(); // Refresh survey list after adding
        } catch (err) {
            console.error('Error adding survey:', err);
        }
    }

    // Handle updating a question
    async updateQuestion(questionId, newQuestionJson, newQuestionType) {
        try {
            await this.dataManipulation.updateQuestion(questionId, newQuestionJson, newQuestionType);
            console.log('Question updated');
            this.updateQuestionList(); // Refresh question list after updating
        } catch (err) {
            console.error('Error updating question:', err);
        }
    }

    // Handle removing a question
    async removeQuestion(questionId) {
        try {
            await this.dataManipulation.removeQuestion(questionId);
            console.log('Question removed');
            this.updateQuestionList(); // Refresh question list after removal
        } catch (err) {
            console.error('Error removing question:', err);
        }
    }

    // Handle removing a question from a survey
    async removeQuestionFromSurvey(surveyId, questionId) {
        try {
            await this.dataManipulation.removeQuestionFromSurvey(surveyId, questionId);
            console.log('Question removed from survey');
            this.updateSurveyQuestions(surveyId); // Refresh question list for this survey
        } catch (err) {
            console.error('Error removing question from survey:', err);
        }
    }

    async updateQuestionList() {
        try {
            // Fetch all questions from the database
            const questions = await this.dataManipulation.getAllQuestions(); // Assume a method to get all questions

            // Get the container where the questions will be displayed
            const questionsContainer = document.getElementById("questionsContainer");

            // Clear the current list of questions
            questionsContainer.innerHTML = '';

            // Loop through the questions and create the DOM elements
            questions.forEach(question => {
                const questionElement = document.createElement('div');
                questionElement.classList.add('question-container');
                questionElement.setAttribute('data-id', question.question_id);

                questionElement.innerHTML = `
                <div class="question-header">
                    <input type="text" value="${question.question_text}" readonly />
                    <select onchange="updateQuestionContent(this)">
                        <option value="multiple-choice" ${question.question_type === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                        <option value="essay" ${question.question_type === 'essay' ? 'selected' : ''}>Essay</option>
                        <option value="rating" ${question.question_type === 'rating' ? 'selected' : ''}>Rating</option>
                        <option value="true-false" ${question.question_type === 'true-false' ? 'selected' : ''}>True or False</option>
                    </select>
                </div>
                <div class="options">
                    <!-- Options will be dynamically added here based on question type -->
                </div>
                <div class="side-buttons">
                    <button class="side-button" onclick="editQuestion(${question.question_id})">Edit</button>
                    <button class="side-button" onclick="removeQuestion(${question.question_id})">Remove</button>
                </div>
            `;
                questionsContainer.appendChild(questionElement);

                // Initialize the options for the question based on its type
                this.updateQuestionContent(questionElement.querySelector('select'));
            });
        } catch (err) {
            console.error('Error updating question list:', err);
        }
    }


    async updateSurveyList() {
        try {
            // Fetch all surveys from the database
            const surveys = await this.dataManipulation.getAllSurveys(); // Assume a method to get all surveys

            // Get the container where the surveys will be displayed
            const surveysContainer = document.getElementById("surveysContainer");

            // Clear the current list of surveys
            surveysContainer.innerHTML = '';

            // Loop through the surveys and create the DOM elements
            surveys.forEach(survey => {
                const surveyElement = document.createElement('div');
                surveyElement.classList.add('survey-container');
                surveyElement.setAttribute('data-id', survey.survey_id);

                surveyElement.innerHTML = `
                <div class="survey-header">
                    <input type="text" value="${survey.survey_name}" readonly />
                    <span>Status: ${survey.status}</span>
                </div>
                <div class="survey-actions">
                    <button class="side-button" onclick="viewSurvey(${survey.survey_id})">View</button>
                    <button class="side-button" onclick="editSurvey(${survey.survey_id})">Edit</button>
                    <button class="side-button" onclick="removeSurvey(${survey.survey_id})">Remove</button>
                </div>
            `;
                surveysContainer.appendChild(surveyElement);
            });
        } catch (err) {
            console.error('Error updating survey list:', err);
        }
    }


    // Update questions for a specific survey (UI update)
    async updateSurveyQuestions(surveyId) {
        try {
            const questions = await this.dataManipulation.getQuestionsForSurvey(surveyId);
            // Logic to update the UI with the list of questions for this survey
            console.log('Survey questions updated:', questions);
        } catch (err) {
            console.error('Error updating survey questions:', err);
        }
    }

    async getAllQuestions() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM question';
            this.db.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results); // Return all questions
                }
            });
        });
    }

    // Fetch all surveys
    async getAllSurveys() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM survey';
            this.db.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results); // Return all surveys
                }
            });
        });
    }
}
