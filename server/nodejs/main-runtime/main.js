const express = require('express')
const {authorize} = require('./middleware/auth')
const main = express()

const path = require('path')

const publicDir = path.join(__dirname, "resources")

//Middleware that exposes the css resources statically
main.use('/static/css', express.static(path.join(__dirname,"resources","css")))

//Middleware that exposes the js resources statically
main.use('/static/js',express.static(path.join(__dirname,"resources","js")))

main.use(`/static/images`,express.static(path.join(__dirname,"resources","images")))

//Sample use of middleware
main.use('/:token',authorize, async(req,res)=>{
    res.status(200).json({message:"success"})
})


module.exports = main