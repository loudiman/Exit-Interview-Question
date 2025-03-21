const pool = require('../util/mysql')

class SurveyDAL{

    static async getAllSurvey(){
        try{
            const [result] = await pool.query(`SELECT * FROM survey`)
            return result
        }catch(Error){
            console.log(Error.message)
        }
    }

    static async deleteSurvey(surveyID){
        const query = `DELETE FROM survey WHERE survey_id = ?`
        try{
            const[result] = await pool.execute(query, [surveyID])
            if(result.affectedRows == 0){
                console.log("failed")
                throw new Error("Delete failed")
            }

        }catch(error){
            throw new Error("delete failed")
        }
    }

    static async getAllPublishedSurvey(username){
        try{
            console.log("username: "+username)
            var query = 'SELECT s.survey_id, s.survey_title, s.survey_description FROM survey as s LEFT JOIN student as stud ON s.program_id = stud.program_id WHERE stud.username = ? AND s.period_start < CURDATE()'
            const [result] = await pool.query(query,[username])
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async getQuestions(surveyID){
        console.log(surveyID)
        var query = "SELECT q.question_id, q.question_json, q.question_type FROM question AS q LEFT JOIN questionaire "+
                    "ON q.question_id = questionaire.question_id "+
                    "WHERE questionaire.survey_id = ?"

        try{
            const[result] = await pool.query(query,[surveyID])
            console.log(result)
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async getRespondents(surveyID){
        var query = "SELECT u.username, u.given_name, u.last_name, r.responded FROM responders AS r LEFT JOIN user AS u ON r.username = u.username WHERE r.survey_id = ?";

        try{
            const [result] = await pool.query(query, surveyID)
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    //No longer supported by the database
    // static async updateSurveyStatus(surveyDAO){
    //     var status = surveyDAO.status
    //     var surveyID = survveyDAO.survey_id
    //
    //     try{
    //         var query = "UPDATE survey SET status = ? WHERE survey_id = ?"
    //         const [result] = await pool.execute(query,[status, surveyID])
    //         return result
    //     }catch(error){
    //         throw new Error(error.message)
    //     }
    // }

    static async updateResponder(username, responded){
        var query = "UPDATE responders SET responded = ? WHERE username = ?"

        try{
            const[result] = await pool.query(query, [responded, username])
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async insertSurvey(surveyDAO) {
        var surveyTitle = surveyDAO.survey_title;
        var surveyDescription = surveyDAO.survey_description;
        var programID = surveyDAO.program_id;
        var periodStart = surveyDAO.period_start;
        var periodEnd = surveyDAO.period_end;

        try {
            var programIDObject = { program_id: programID.program_id };

            var query = "INSERT INTO survey(survey_title, survey_description, program_id, period_start, period_end) VALUES(?,?,?,?,?)";

            const [result] = await pool.execute(query, [
                surveyTitle,
                surveyDescription,
                JSON.stringify(programIDObject),
                periodStart,
                periodEnd
            ]);

            return result.insertId;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }


    static async insertQuestion(question){
        var questionType = question.question_type
        var questionJSON = JSON.stringify(question.question_json)

        try{
            var query = "INSERT INTO question (question_json, question_type) VALUES(?,?)"
            const [result] = await pool.execute(query, [questionJSON, questionType])
        return result.insertId
        }catch(error){
            throw new Error(error.message)
        }
    }
    // This returns a stack of question ID's
    static async insertQuestions(questions){
        var idArray = []

        for(let question of questions){
            console.log(question)
            var id = await this.insertQuestion(question)
            idArray.push(id)
        }

        return idArray
    }

    static async insertQuestionnaire(questionsID, surveyID) {
        console.log(questionsID)

        // Flatten the values array
        const flattenedValues = questionsID.flatMap(questionID => [questionID, surveyID]);

        // Create placeholders dynamically based on the number of questions
        const placeholders = questionsID.map(() => "(?, ?)").join(",");

        var query = `INSERT INTO questionaire (question_id, survey_id) VALUES ${placeholders}`;

        try {
            const [result] = await pool.execute(query, flattenedValues);
            return true;
        } catch (error) {
            console.error('Error inserting questionnaire:', error);
            throw new Error(error.message);
        }
    }

    static async deleteResponders(surveyID){
        var query = `DELETE FROM responders WHERE survey_id = ?`
        try{
            const [result] = await pool.execute(query, [surveyID])
            return result.affectedRows
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async insertResponders(responders, surveyID) {
        // If no responders, return early
        if (responders.length === 0) return true;

        // Batch the inserts to prevent packet size issues
        const BATCH_SIZE = 500; // Adjust based on your needs
        let results = true;

        for (let i = 0; i < responders.length; i += BATCH_SIZE) {
            const batchResponders = responders.slice(i, i + BATCH_SIZE);

            const placeholders = batchResponders.map(() => "(?,?,?)").join(',');
            const flattenedValues = batchResponders.flatMap(responder => [
                responder.username,
                surveyID,
                0
            ]);

            const query = `INSERT INTO responders (username, survey_id, responded) VALUES ${placeholders}`;

            try {
                await pool.execute(query, flattenedValues);
            } catch (error) {
                console.error('Error inserting responders batch:', error);
                results = false;
                throw new Error("Error inserting into responders: "+error.message);
            }
        }

        return results;
    }

    static async insertResponse(responseJSON, surveyID){
        var query = `INSERT INTO responses (survey_id, response_json) VALUES(?,?)`
        try{
            const[result] = await pool.execute(query, [surveyID, responseJSON])
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async getSurveySummary(survey_id) {
        console.log("Getting summary");
        var query = `
            SELECT s.survey_id, s.survey_title, s.survey_description, s.program_id, s.period_start, s.period_end,
                   COUNT(CASE WHEN r.responded = TRUE THEN 1 END) AS total_responded,
                   COUNT(*) AS total_responders
            FROM survey s
                     LEFT JOIN responders r ON s.survey_id = r.survey_id
            GROUP BY s.survey_id LIMIT 100;
        `;

        if (survey_id) {
            var query = `
                SELECT s.survey_id, s.survey_title, s.survey_description, s.program_id, s.period_start, s.period_end,
                       COUNT(CASE WHEN r.responded = TRUE THEN 1 END) AS total_responded,
                       COUNT(*) AS total_responders
                FROM survey s
                         LEFT JOIN responders r ON s.survey_id = r.survey_id
                WHERE s.survey_id = ${survey_id}
                GROUP BY s.survey_id LIMIT 100;
            `;
        }

        try {
            const [result] = await pool.query(query);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    static async putNewSurveyData(survey_id, survey_title, survey_description, program_id, period_start, period_end) {
        const query = "UPDATE survey SET survey_title = ?, survey_description = ?, program_id = ?, period_start = ?, period_end = ? WHERE survey_id = ? AND period_start > CURDATE();";

        try {
            console.log("this id ",survey_id)
            const programIDJSON = {
                "program_id": {program_id}
            }

            console.log(programIDJSON.program_id)
            // Await the query execution and handle the result
            const [results] = await pool.execute(query, [survey_title, survey_description, JSON.stringify(programIDJSON.program_id), period_start, period_end, survey_id]);
            console.log('Query executed successfully:', results);
            return results
        } catch (error) {
            // Log and throw the error with a helpful message
            console.error('Error executing query:', error.message);
            throw new Error(`Error executing query: ${error.message}`);
        }
    }

    static async putNewQuestion(surveyID, questionJSON, questionType,operationType, questionID){
        console.log(await this.isSurveyPublishedHelper(surveyID))
        if(await this.isSurveyPublishedHelper(surveyID)){
            throw new Error("Survey is already published")
        }

        try{
            switch(operationType){
                case("add"):
                    var questionQuery = `INSERT INTO question (question_json, question_type) VALUES(?,?)`
                    var questionaireQuery = `INSERT INTO questionaire (survey_id, question_id) VALUES(?,?)`
                    
                    var [questionResult] = await pool.execute(questionQuery, [questionJSON, questionType])
                    var newQuestionID = await questionResult.insertId

                    console.log(newQuestionID)
                    
                    var [result] = await pool.query(questionaireQuery, [surveyID, newQuestionID])
                    if (result.affectedRows == 0){
                        throw new Error("error updating quesetionaire table")
                    }
                    break
                case("modify"):
                    var query = `UPDATE question SET question_json = ?, question_type = ? WHERE question_id = ?`
                    var [result] = await pool.query(query, [questionJSON, questionType, questionID])
                    if (result.affectedRows == 0){
                        throw new Error("error modifying question")
                    }
                    break
                case("remove"):
                    var query = `DELETE FROM question WHERE question_id = ?`
                    var [result] = await pool.query(query, questionID)
                    if(result.affectedRows == 0){
                        throw new Error("error deleting question")
                    }
                    break
                default:
                    throw new Error("Invalid operation")
                    
            }
        }catch(error){
            console.log(error.message)
            throw new Error(error.message)
        }
    }

    static async isSurveyPublishedHelper(surveyID){
        var query = `SELECT * FROM survey WHERE survey_id = ? AND period_start > CURDATE()`
        try{
            const [result] = await pool.query(query, surveyID)
            if(result.length == 0){
                return true
            }
            return false
        }catch(error){
            console.log(error.message)
        }
    }

    static async getResponses(surveyId){
        var query = `SElECT * FROM responses WHERE survey_id = ?`
        try{
            const [result] = await pool.query(query, surveyId)
            return result
        }catch(error){
            throw new Error("Failed to fetch")
        }
    }
}

module.exports = SurveyDAL