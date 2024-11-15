const express = require('express')
const {UserDAL, SurveyDAL} = require('./dal/dal')
const dalService = express.Router()

dalService.use(express.json())

dalService.get('/',(req,res)=>{
    res.send("This is the api endpoint")
})

dalService.get('/users', async (req,res) => {
    try{
        console.log("processing")
        const [rows] = await UserDAL.getAllUsers()
        res.status(200).json(rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Failed to retrieve users'})
    }
})

dalService.get('/user/:username', async(req, res)=>{
    const {username} = req.body
    try{
        const [rows] = await UserDAL.getUserByUsername(username)
        res.status(200).json(rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Failed to retrieve user'})
    }
    
})

dalService.post('/user/:username', async(req, res) => {
    const {username, password, newPassword} = req.body
    try{
        const [rows] = await UserDAL.changePass(username, password, newPassword)
        res.status(200).json(rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Failed to change pass'})
    }
})

dalService.post('/user', async(req, res) => {
    const {username, password, last_name, given_name, type} = req.body
    try{
        const [rows] = await UserDAL.addUser(username,password,last_name,given_name, type)
        res.status(200).json(rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Failed to add user'})
    }
})

dalService.get('/surveys/:username', async(req, res)=>{
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

module.exports = dalService;
