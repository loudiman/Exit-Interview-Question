const express = require(`express`)
const ProgramController = require('../controller/program-controller')
const programRoutes = express.Router()

programRoutes.get('/',(req,res)=>{
    res.send("Hello there, This is the survey endpoint")
})

programRoutes.get("/programs", ProgramController.handleGetAllPrograms)

module.exports = programRoutes;