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
            const [rows] = await pool.query("SELECT username, last_name, given_name, type FROM user WHERE username = ?",[username])
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

module.exports = UserDAL