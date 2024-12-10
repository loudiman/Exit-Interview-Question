const express = require('express')
const {userRoutes, surveyRoutes} = require(`./routes`)

const dalService = express.Router()

dalService.use(express.json())

dalService.get('/',(req,res)=>{
    res.send("This is the api endpoint")
})

dalService.use('/user-service/',userRoutes)
dalService.use('/survey-service/',surveyRoutes)


module.exports = dalService;
