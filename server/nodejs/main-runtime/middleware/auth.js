async function authorize(req,res, next){
    const token = req.params.token
    console.log(`Middleware ${token}`)
    const response = await fetch(`http://localhost/api/auth/authorize?token=${token}`)
    console.log(!response.ok)
    if(!response.ok){
        res.status(response.status).json(await response.json)
        return
    }
    console.log("triggering next")
    return next()
}


module.exports = {authorize}