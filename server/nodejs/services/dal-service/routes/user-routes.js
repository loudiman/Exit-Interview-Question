const express = require(`express`)
const {UserDAL} = require(`../dal`)
const userRoutes = express.Router()

userRoutes.use(express.json())

function checkPerm(req,res,next){
    const{userType} = req.body
    if(userType != "admin"){
        res.status(403).json({error:"Invalid body"})
        return
    }
    next()
}

userRoutes.get('/',(req, res) =>[
    res.send("This is the index of user endpoints")
])


userRoutes.get('/users',checkPerm ,async (req,res) => {
    const{question_type = "unfiltered"} = req.body
    if(question_type != "unfiltered"){
        try{
            const rows = filteredGet()
            res.status(200).json({users: rows})
            return
        }catch(error){
            console.log(error)
            res.status(400).json({"error":"server error"})
        }
    }
    try{
        console.log("processing")
        const rows = await UserDAL.getAllUsers()
        res.status(200).json({users: rows})
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Failed to retrieve users'})
    }
})

async function filteredGet(req){
    //TODO: use the custom JSON objcet from postman to generate query filter statements
    const equalFilter = req.body.filters.equals
    const notFilter = req.body.filters.not

    const statements = []

    createEqualStatements(statements)
    createNonEqualStatements(statements)

    console.log(equalFilter)
    console.log(notFilter)

    try{
        const {rows} = UserDAL.getUsersByFilter(statements)
        return rows
    }catch(error){
        throw new Error(error.message)
    }
}

function createEqualStatements(output, filters, cols){
    const keyset = cols

    var size = filters.size
    if(size > 1){
        for(i in keyset){
            output.append(`${i} == ${filters.i}`)
            return
        }
    }


}

// Algorithm:
//      1. For every col
//      2. Check for number of filters per col
//      3. if no. of filters > 1 use NOT IN()
//      4. if not use ==
//      5. append to every new statement to output string
function createNonEqualStatements(output, filters, cols){
    const keyset = cols
    if(filters.size > 1){
        for(i in keyset){
            
        }
    }
}

userRoutes.get('/user/:username',checkPerm ,async(req, res)=>{
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


module.exports = userRoutes