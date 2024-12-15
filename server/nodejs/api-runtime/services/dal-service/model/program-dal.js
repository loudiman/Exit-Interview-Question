const pool = require('../util/mysql')

class ProgramDAL{
    static async getProgram(id){
        var query = "SELECT * FROM program WHERE program_id = ?"

        try{
            const[result] = await pool.query(query,[id])
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    static async getAllPrograms(program_id){
        try{
            if(!program_id){
                const [result] = await pool.query("SELECT * FROM program")
                return result
            }
            const [result] = await pool.query(`SELECT * FROM program WHERE program_id = ${program_id}`)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = ProgramDAL