const {ProgramDAL} = require('../model')

class ProgramController {

    static async handleGetProgram(req, res){
        const{survey_id} = req.params
        console.log(survey_id)
        try{
            const rows = await ProgramDAL.getProgram(survey_id)
            console.log(rows)
            res.status(200).json({"availability":rows})
        }catch(error){
            res.status(400).json("server error")
        }
    }

    static async handleGetAllPrograms(req,res){
        const program_id = req.param.program_id
        try{
            const rows = await ProgramDAL.getAllPrograms(program_id)
            res.status(200).json({
                availability: rows,
            });
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = ProgramController;