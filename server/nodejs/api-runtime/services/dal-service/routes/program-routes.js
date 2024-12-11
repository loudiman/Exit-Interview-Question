const express = require('express')
const ProgramController = require('../controllers/program-controller')
const programRoutes = express.Router()

programRoutes.get('/',(req,res)=>{
    res.send("Hello there, This is the survey endpoint")
})

