const express = require(`express`)
const SurveyController = require('../controller/survey-controller')
const surveyRoutes = express.Router()

surveyRoutes.get('/',(req,res)=>{
    res.send("Hello there, This is the survey endpoint")
})

surveyRoutes.get("/survey", SurveyController.handleGetAllSurvey)

surveyRoutes.get("/questions/:survey_id", SurveyController.handleGetQuestionsOnId)

surveyRoutes.get('/survey/:username', SurveyController.handleGetSurveysOfUser)

surveyRoutes.post('/survey', SurveyController.handlePostSurvey)

surveyRoutes.post('/survey/publish/:survey_id', SurveyController.handlePostUpdateSurvey)

surveyRoutes.post('/response', SurveyController.handlePostResponse)

module.exports = surveyRoutes