const mysql = require('mysql2');

class SurveyCreationDataManipulation {
    constructor() {
        // Initialize MySQL connection
        this.db = mysql.createConnection({
            host: 'localhost',
            user: 'root', // Your MySQL username
            password: '', // Your MySQL password
            database: 'amalgam' // Your database name
        });

        // Connect to the database
        this.db.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                return;
            }
            console.log('Connected to MySQL database');
        });
    }

    // Insert a new question into the database
    addQuestion(questionJson, questionType) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO question (question_json, question_type)
                VALUES (?, ?)
            `;
            this.db.query(query, [JSON.stringify(questionJson), questionType], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('New question added:', result.insertId);
                    resolve(result.insertId); // Return question_id of the new question
                }
            });
        });
    }

    // Insert a new survey into the database
    addSurvey(surveyStatus, programFilter) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO survey (status, program_filter)
                VALUES (?, ?)
            `;
            this.db.query(query, [surveyStatus, programFilter], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('New survey created:', result.insertId);
                    resolve(result.insertId); // Return survey_id of the new survey
                }
            });
        });
    }

    // Insert questions into the questionaire table (for survey-question mapping)
    addQuestionToSurvey(surveyId, questionId) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO questionaire (survey_id, question_id)
                VALUES (?, ?)
            `;
            this.db.query(query, [surveyId, questionId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Question added to survey:', surveyId, questionId);
                    resolve(result);
                }
            });
        });
    }

    // Update a question in the database
    updateQuestion(questionId, newQuestionJson, newQuestionType) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE question
                SET question_json = ?, question_type = ?
                WHERE question_id = ?
            `;
            this.db.query(query, [JSON.stringify(newQuestionJson), newQuestionType, questionId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Question updated:', questionId);
                    resolve(result);
                }
            });
        });
    }

    // Remove a question from the database
    removeQuestion(questionId) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM question WHERE question_id = ?
            `;
            this.db.query(query, [questionId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Question removed:', questionId);
                    resolve(result);
                }
            });
        });
    }

    // Remove a question from the questionaire (survey-question mapping)
    removeQuestionFromSurvey(surveyId, questionId) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM questionaire WHERE survey_id = ? AND question_id = ?
            `;
            this.db.query(query, [surveyId, questionId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Question removed from survey:', surveyId, questionId);
                    resolve(result);
                }
            });
        });
    }

    // Fetch all questions for a survey
    getQuestionsForSurvey(surveyId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT q.question_id, q.question_json, q.question_type
                FROM question q
                JOIN questionaire qi ON q.question_id = qi.question_id
                WHERE qi.survey_id = ?
            `;
            this.db.query(query, [surveyId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results); // Return list of questions for the given survey
                }
            });
        });
    }

    // Fetch all surveys
    getAllSurveys() {
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

    // Method to get all questions
    getAllQuestions(callback) {
        const query = 'SELECT * FROM question';  // SQL query to get all questions

        this.db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching questions:', err);
                callback(err, null);
                return;
            }
            callback(null, results);  // Pass the results to the callback function
        });
    }

    // Get a specific survey by ID
    getSurveyById(surveyId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM survey WHERE survey_id = ?';
            this.db.query(query, [surveyId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]); // Return survey details
                }
            });
        });
    }

    // Save the response for a survey question
    saveResponse(surveyId, username, responseJson) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO responses (survey_id, response_json)
                VALUES (?, ?)
            `;
            this.db.query(query, [surveyId, JSON.stringify(responseJson)], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Response saved:', result.insertId);
                    resolve(result.insertId); // Return response_id of the new response
                }
            });
        });
    }

    // Record which users have responded to a survey
    markSurveyAsResponded(username, surveyId) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE responders
                SET responded = 1
                WHERE username = ? AND survey_id = ?
            `;
            this.db.query(query, [username, surveyId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Survey marked as responded:', username, surveyId);
                    resolve(result);
                }
            });
        });
    }
}

module.exports = SurveyCreationDataManipulation;