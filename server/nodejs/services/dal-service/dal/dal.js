const pool = require('../db/mysql')

class UserDAL {
    static async getAllUsers(){
        try{
            const [rows] = await pool.query("SELECT username, last_name, given_name, type FROM user")

            return rows;
        }catch(error){
            throw new Error('Error fetching users '+error.message)
        }
    }

    static async getUserByUsername(username){
        try{
            const [rows] = await pool.query("SELECT username, last_name, given_name, type FROM user WHERE ?",[username])
            return rows
        }catch(error){
            throw new Error("Error fetching user: "+username+" with error:"+error.message)
        }
    }

    static async addUser(username, password, lastName, givenName, type){
        try{
            const [result] = await pool.execute('INSERT INTO user (username,hashed_password,last_name,first_name,type) VALUES(?,?,?,?,?)',[username, password, lastName, givenNamme,type])
            return result
        }catch(error){
            throw new Error("Error adding user: "+error.message)
        }
    }

    static async changePass(username, password, newPassword){
        try{
            const [result] = await pool.execute(' UPDATE user SET hashed_password = ? WHERE username = ? AND hashed_password = ?',[newPassword, username, password])
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }
}

class SurveyDAL{
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
}
module.exports = {UserDAL, SurveyDAL};