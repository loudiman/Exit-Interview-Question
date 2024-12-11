const pool = require('../util/mysql')

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

    static async getAllPrograms(){
        try{
            const [result] = await pool.query("SELECT * FROM programs")
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = ProgramDAL