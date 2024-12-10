const express = require('express');
const {publishSurveyRoutes} = require(`./routes`)

const publishSurveyService = express.Router()

publishSurveyService.use(express.json())

publishSurveyService.get(`/`, (req, res) => {
    res.send(`This is the api endpoint`)
})

publishSurveyService.use(`/publish-survey/`,publishSurveyRoutes)

module.exports = publishSurveyService;