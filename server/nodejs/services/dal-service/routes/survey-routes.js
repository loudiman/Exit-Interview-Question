const express = require(`express`)
const {SurveyDAL} = require(`../dal/index`)
const surveyRoutes = express.Router()

surveyRoutes.get('/',(req,res)=>{
    res.send("Hello there, This is the survey endpoint")
})

surveyRoutes.get("/questions/:survey_id",async (req,res)=>{
    const{survey_id} = req.params
    console.log(survey_id)
    try{
        const rows = await SurveyDAL.getQuestions(survey_id)
        console.log(rows)
        res.status(200).json({"questions":rows})
    }catch(error){
        res.status(400).json("server error")
    }
})

surveyRoutes.get('/survey/:username', async(req, res)=>{
    const {username} = req.params
    try{
        const rows = await SurveyDAL.getAllPublishedSurvey(username)

        console.log(rows)
        
        // Ensure `rows` is an array and add `isCompleted` to each survey
        const updatedRows = Array.isArray(rows) 
        ? rows.map(row => ({ ...row, isComplete: false })) 
        : [{ ...rows, isCompleted: false }];

        // Wrap the updated rows in an object with the `survey` key
        const result = {
            surveys: updatedRows
        };

        res.status(200).json(result)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'something went wrong'})
    }
})

surveyRoutes.get('/survey')

module.exports = surveyRoutes