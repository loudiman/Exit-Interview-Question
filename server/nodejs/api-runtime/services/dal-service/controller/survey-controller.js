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
        console.log(JSON.stringify(req.body))
        const {surveyReq, questions, users} = req.body
    
    

        let survey = {
            survey_title: surveyReq.survey_title,
            survey_description:surveyReq.survey_description,
            program_id: surveyReq.program_id,
            period_start: surveyReq.period_start,
            period_end: surveyReq.period_end,
            status: surveyReq.status
        }
    
        try{
            const surveyID = await SurveyDAL.insertSurvey(survey)
            const questionIDS = await SurveyDAL.insertQuestions(questions)
            const questionnaireResult = await SurveyDAL.insertQuestionnaire(questionIDS, surveyID)
            const respondersResult = await SurveyDAL.insertResponders(users, surveyID)

            res.status(200).json({message:"success"})
        }catch(error){
            console.log(error)
            res.status(500).json({message:error.message})
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
            res.status(200).json({message:"success"})
        }catch(error){
           res.status(500).json({message:"error"}) 
        }
    }

    static async handleGetSurveySummary(req,res){
        const survey_id = req.query.survey_id
        console.log("hit")
        try{
            if(!survey_id){
                var result = await SurveyDAL.getSurveySummary()
            }else{
                var result = await SurveyDAL.getSurveySummary(survey_id)
            }
            console.log(`Result: ${result}`)
            res.status(200).json(result)
        }catch(error){
            res.status(500).json(error.message)
        }
    }

    static async handlePutSurvey(req, res){
        console.log("UPDATING SURVEY -------------------------------------")
        try{

            const {survey_id, survey_title, survey_description, program_id , period_start, period_end, responders} = req.body
            if(!responders){
                res.status(400).json({message:"responders missing"})
                return
            }

            if(!survey_id){
                res.status(400).json({message:"survey_id missing"})
                return
            }

            try{
                console.log("INVOKING DAL SURVEY -------------------------------------")
                const { affectedRows } = await SurveyDAL.putNewSurveyData(survey_id, survey_title, survey_description, program_id, period_start, period_end)
                if(affectedRows == 0){
                    res.status(400).json({message:"Survey is already published cannot edit"})
                    return
                }
                console.log("UPDATED")

                await SurveyDAL.deleteResponders(survey_id)
                console.log("PREVIOUS RESPONDERS DELETED")
                const result = await SurveyDAL.insertResponders(responders,survey_id)
                if(!result){
                    res.status(400).json({message:"something failed hehe"})
                    return
                }
                console.log("NEW RESPONDERS INSERTED")
                res.status(200).json({message:"success"})
                return
            }catch(Error){
                console.log(Error.message)
                res.status(500).json({message:"server error"})

                    return
            }

        }catch(Error){
            res.status(400).json({message:"JSON has missing data"})
            return
        }
    }
       
    static async handlePutQuestion(req,res){
        const {surveyID, questionJSON,questionType,operation, questionID} = req.body
        try{
            console.log("Updatingg question")
            const result = await SurveyDAL.putNewQuestion(surveyID,questionJSON,questionType,operation,questionID)
            res.status(200).json({message:"success"})
        }catch(Error){
            res.status(500).json({message:Error.message})
        }
    }

    static async handleGetResponses(req,res){
        const {survey_id} = req.body
        try{
            const result = await SurveyDAL.getResponses(survey_id)
            res.status(200).json({result})
        }catch(Error){
            res.status(500).json({message:"failed to fetch"})
        }
    }

    static async handleGetRespondents(req,res){
        const {survey_id} = req.body
        try{
            const result = await SurveyDAL.getRespondents(survey_id)
            res.status(200).json(result)
        }catch(error){
            res.status(500).json({message:"failed to retrieve"})
        }
    }

    static async handleDeleteSurvey(req,res){
        const survey_id = req.params.survey_id
        console.log(survey_id)

        try{
            const result = await SurveyDAL.deleteSurvey(survey_id)
            res.status(200).json({message:"success"})
        }catch(error){
            res.status(500).json({message:"failed"})
        }
    }
}


module.exports = SurveyController