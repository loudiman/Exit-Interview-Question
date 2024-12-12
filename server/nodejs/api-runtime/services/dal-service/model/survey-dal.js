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
            var query = 'SELECT s.survey_id, s.survey_title FROM survey as s LEFT JOIN student as stud ON s.program_id = stud.program_id WHERE stud.username = ? AND s.status = "published"'
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
        var query = "SELECT * FROM responders WHERE survey_id = ?"

        try{
            const[result] = await pool.query(query, surveyID)
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }


    static async updateSurveyStatus(surveyDAO){
        var status = surveyDAO.status
        var surveyID = survveyDAO.survey_id

        try{
            var query = "UPDATE survey SET status = ? WHERE survey_id = ?"
            const [result] = await pool.execute(query,[status, surveyID])
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async updateResponder(username, responded){
        var query = "UPDATE responders SET responded = ? WHERE username = ?"

        try{
            const[result] = await pool.query(query, [responded, username])
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async insertSurvey(surveyDAO){
        var surveyTitle = surveyDAO.survey_title
        var programID = surveyDAO.program_id
        var periodStart = surveyDAO.survey_start
        var periodEnd = surveyDAO.survey_end
        var status = surveyDAO.status

        try{
            var query = "INSERT INTO survey(survey_title, status, program_id, period_start, period_end) VALUES(?,?,?,?,?)"
            const[result] = await pool.execute(query,[surveyTitle, status, programID, periodStart, periodEnd])
            return result.insertId
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async insertQuestion(question){
        var questionType = question.question_type
        var questionJSON = question.question_json

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

        for(question of questions){
            var id = await this.insertQuestion(question)
            idArray.push(id)
        }

        return id
    }

    static async insertQuesetionnaire(questionsID, surveyID){
        const placeholders = questionsID.map(()=> "(?, ?)").join(",")
        const values = questionsID.map((questionID)=>[questionID, surveyID])
        
        var query = `INSERT INTO questionaire (question_id, survey_id) VALUES ${placeholders}`

        try{
            const[result] = await pool.execute(query, values)
            return true
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async insertResponders(responders, surveyID){
        const placeholders = responders.map(() => "(?,?,?)")
        const values = responders.map((responder)=>[responder.username, surveyID, 0])

        var query = `INSERT INTO responders (username, survey_id, responded) VALUES ${placeholders}`

        try{
            const[result] = await pool.execute(query, values)
            return true
        }catch(error){
            throw new Error(error.message)
        }
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

    static async getSurveySummary(){
        console.log("Getting summary")
        const query = `
        SELECT s.survey_id, s.survey_title, s.status, s.program_id, s.period_start, s.period_end,
        COUNT(CASE WHEN r.responded = TRUE THEN 1 END) AS total_responded,
        COUNT(*) AS total_responders
        FROM survey s
        LEFT JOIN responders r ON s.survey_id = r.survey_id
        GROUP BY s.survey_id LIMIT 100;
    `;
    
        
        try{
            const[result] = await pool.execute(query)

            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async putNewSurveyData(survey_id, survey_title, status, program_id, period_start, period_end) {
        const query = "UPDATE survey SET survey_title = ?, status = ?, program_id = ?, period_start = ?, period_end = ? WHERE survey_id = ? AND period_start > CURDATE();";

        try {
            // Await the query execution and handle the result
            const [results] = await pool.execute(query, [survey_title, status, program_id, period_start, period_end, survey_id]);
            console.log('Query executed successfully:', results);
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
}

module.exports = SurveyDAL