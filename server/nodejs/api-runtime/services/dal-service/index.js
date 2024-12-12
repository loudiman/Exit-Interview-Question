const express = require('express')
const {userRoutes, surveyRoutes, programRoutes} = require(`./routes`)

const dalService = express.Router()

dalService.use(express.json())

dalService.get('/',(req,res)=>{
    res.send("This is the api endpoint")
})

dalService.use('/program-service', programRoutes)
dalService.use('/user-service/',userRoutes)
dalService.use('/survey-service/',surveyRoutes)


module.exports = dalService;
