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
        try{
            const rows = await ProgramDAL.getAllPrograms()
            res.status(200).json({
                availability: rows,
            });
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}