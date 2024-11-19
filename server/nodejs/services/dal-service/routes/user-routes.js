const express = require(`express`)
const {UserDAL} = require(`../dal`)
const userRoutes = express.Router()

userRoutes.get('/',(req, res) =>[
    res.send("This is the index of user endpoints")
])


userRoutes.get('/users', async (req,res) => {
    try{
        console.log("processing")
        const rows = await UserDAL.getAllUsers()
        res.status(200).json({users: rows})
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Failed to retrieve users'})
    }
})

userRoutes.get('/user/:username', async(req, res)=>{
    const {username} = req.params
    console.log(username)
    try{
        const [rows] = await UserDAL.getUserByUsername(username)
        console.log(rows)
        res.status(200).json(rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Failed to retrieve user'})
    }
    
})

userRoutes.post('/user/:username', async(req, res) => {
    const {username, password, newPassword} = req.body
    try{
        const [rows] = await UserDAL.changePass(username, password, newPassword)
        res.status(200).json(rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Failed to change pass'})
    }
})

userRoutes.post('/user', async(req, res) => {
    const {username, password, last_name, given_name, type} = req.body
    try{
        const [rows] = await UserDAL.addUser(username,password,last_name,given_name, type)
        res.status(200).json(rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Failed to add user'})
    }
})

//TODO: Do the endpoint with reusable filters

module.exports = userRoutes