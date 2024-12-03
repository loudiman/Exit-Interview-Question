const express = require('express')
const app = express()

const path = require('path')

const publicDir = path.join(__dirname, "resources")

//Middleware that exposes the css resources statically
app.use('/static/css', express.static(path.join(__dirname,"resources","css")))

//Middleware that exposes the js resources statically
app.use('/static/js',express.static(path.join(__dirname,"resources","js")))

app.use(`/static/images`,express.static(path.join(__dirname,"resources","images")))

app.get("/",(req, res)=>{
   const adminCreation = path.join(__dirname,"resources","views","survey_creation.html");
   res.sendFile(adminCreation);
});

module.exports = app