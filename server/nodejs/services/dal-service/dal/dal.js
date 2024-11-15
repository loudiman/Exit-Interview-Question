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
}

module.exports = {UserDAL, SurveyDAL};