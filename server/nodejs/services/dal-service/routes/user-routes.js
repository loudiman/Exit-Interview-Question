const express = require(`express`)
const {UserDAL} = require(`../dal`)
const userRoutes = express.Router()

userRoutes.use(express.json())

function checkPerm(allowedUserType){
    return (req, res, next) =>{
        const {userType} = req.body
        if(!allowedUserType.includes(userType)){
            res.status(403).json({error:"Access Denied"})
            return;
        }
        next();
    }
}

userRoutes.get('/',(req, res) =>[
    res.send("This is the index of user endpoints")
])


userRoutes.get('/users',checkPerm("admin") ,async (req,res) => {
    try{
        console.log("processing")
        const rows = await UserDAL.getAllUsers()
        res.status(200).json({users: rows})
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Failed to retrieve users'})
    }
})

userRoutes.get('/users/filtered', checkPerm("admin"), async(req,res)=>{
    const{filters} = req.body
    var notJSON = filters[0]
    var equalJSON = filters[1]

    console.log(notJSON)

    var filterStatements = []
    await createStatement("not", notJSON, filterStatements)
    await createStatement("equal", equalJSON, filterStatements)
    
    console.log(filterStatements)
    res.status(200).json(filterStatements)
    
})

function createStatement(type , jsonObject, output){
    console.log("creating")
    let filterStatements = []
    if(type == "not"){
        for(item in jsonObject.not){
            var filters = jsonObject.not[item].map((filter) => `${filter}`).join(",")
            var statement = `${item} NOT IN (${filters})`
            filterStatements.push(statement)
            console.log(statement)
        }
        output.push(filterStatements)
    }
}

userRoutes.get('/user/:username',checkPerm("admin") ,async(req, res)=>{
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

userRoutes.post('/user',checkPerm("admin"), async(req, res) => {
    const {username, password, last_name, given_name, type} = req.body
    var data
    try{
        const [rows] = await UserDAL.addUser(username,password,last_name,given_name, type)
        data = rows

        if(type == 1){
            const {programID, sem, batch, gender} = req.body
            const [rows1] = await UserDAL.addStudent(username, programID, sem, batch, gender)
        }


        res.status(200).json(data) 
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Failed to add user'})
    }
})


module.exports = userRoutes