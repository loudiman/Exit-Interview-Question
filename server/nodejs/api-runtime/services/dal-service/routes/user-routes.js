const express = require(`express`)
const UserController = require(`../controller/user-controller`)
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


userRoutes.get('/users',checkPerm("admin") , UserController.handleGetAllUsers)

userRoutes.get('/users/filtered', checkPerm("admin"), UserController.handleGetFilteredUsers)

userRoutes.get('/user/:username',checkPerm("admin") ,UserController.handleGetByUsername)

userRoutes.post('/user/:username', UserController.handlePostNewPass)

userRoutes.post('/user',UserController.handlePostAddNewUser)


module.exports = userRoutes