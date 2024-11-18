const pool = require('../db/mysql')

class UserDAL {
    // Will return all users
    static async getAllUsers(){
        try{
            const [rows] = await pool.query("SELECT username, last_name, given_name, type FROM user")

            return rows;
        }catch(error){
            throw new Error('Error fetching users '+error.message)
        }
    }

    //Parameter would be an array of filter statements ie. "username = 2233915"
    static async getUsersByFilter(...filterStatements){
        var filters = filterStatements.map((statement) => `${statement}`).join(" AND ")
        var query = `SELECT * FROM users WHERE ${filters}`
        
        try{
            const[result] = await pool.query(query)
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    //Will return a user based on username
    static async getUserByUsername(username){
        try{
            const [rows] = await pool.query("SELECT username, last_name, given_name, type FROM user WHERE ?",[username])
            return rows
        }catch(error){
            throw new Error("Error fetching user: "+username+" with error:"+error.message)
        }
    }

    //Adds a user
    static async addUser(username, password, lastName, givenName, type){
        try{
            const [result] = await pool.execute('INSERT INTO user (username,hashed_password,last_name,first_name,type) VALUES(?,?,?,?,?)',[username, password, lastName, givenNamme,type])
            return result
        }catch(error){
            throw new Error("Error adding user: "+error.message)
        }
    }

    //Changes a pass of a user
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

    static async getQuestions(surveyID){
        var query = "SELECT q.question_id, q.question_json, q.question_type FROM question AS q LEFT JOIN questionaire"+
                    "ON q.question_id = questionaire.question_id"+
                    "WHERE questionaire.survey_id = ?"

        try{
            const[result] = await pool.query(query,[surveyID])
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
            const[result] = pool.execute(query, values)
            return true
        }catch(error){
            throw new Error(error.message)
        }
    }
}

class ProgramDAL{
    static async getProgram(id){
        var query = "SELECT * FROM programs WHERE program_id = ?"

        try{
            const[result] = await pool.query(query,[id])
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }
}
module.exports = {UserDAL, SurveyDAL};