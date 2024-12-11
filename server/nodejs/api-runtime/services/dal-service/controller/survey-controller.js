const {SurveyDAL} = require(`../model`)

class SurveyController{
    
    // For GET '/survey'
    static async handleGetAllSurvey(req,res){
        try{
            const rows = await SurveyDAL.getAllSurvey()
            res.status(200).json(rows)
        }catch(error){
            console.log(error)
            res.status(500)
        }
    }

    // For GET '/questions/:survey_id'
    static async handleGetQuestionsOnId(req, res){
        const{survey_id} = req.params
        console.log(survey_id)
        try{
            const rows = await SurveyDAL.getQuestions(survey_id)
            console.log(rows)
            res.status(200).json({"questions":rows})
        }catch(error){
            res.status(400).json("server error")
        }
    }

    //For GET '/survey/:username'
    static async handleGetSurveysOfUser(req,res){
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
    }

    //For POST '/survey'
    static async handlePostSurvey(req,res){
        const {surveyReq, questions, users} = req.body
    
    

        let survey = {
            survey_title: surveyReq.survey_title,
            program_id: surveyReq.program_id,
            period_start: surveyReq.period_start,
            period_end: surveyReq.perios_end,
            status: surveyReq.status
        }
    
        try{
            const surveyID = await SurveyDAL.insertSurvey(survey)
            const questionIDS = await SurveyDAL.insertQuestions(questions)
            const questionnaireResult = await SurveyDAL.insertQuestionnaire(questionIDS, surveyID)
            const respondersResult = await SurveyDAL.insertResponders(users, surveyID)
            
            res.status(200)
        }catch(error){
            console.log(error)
            res.status(500)
        }
    }

    static async handlePostUpdateSurvey(req,res){
        const {survey_id} = req.params
        const {status} = req.body
        let survey = {
            status:status,
            survey_id: survey_id
        }
    
        try{
            const result = await SurveyDAL.updateSurveyStatus(survey)
            res.status(200)
        }catch(error){
            res.status(500)
        }
    }

    static async handlePostResponse(req,res){
        const {survey_id, response_json} = req.body
        try{
            const result = SurveyDAL.insertResponse(response_json, survey_id)
            res.status(200)
        }catch(error){
           res.status(500) 
        }
    }
}

module.exports = SurveyController