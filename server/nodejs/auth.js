function authenticate(expected, mode){
    return (req, res, next)=> {

        // For debug purposes
        if(mode == "DEBUG"){
            return next()
        }

        const {authorization} = req.headers
        
        if(authorization == expected){
            return next()
        }
        
        res.status(403).send('<h1> 403 Error </h1')
    }
}

module.exports = authenticate