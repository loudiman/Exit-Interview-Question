const express = require('express')
const app = express()

const path = require('path')

const publicDir = path.join(__dirname, "resources")

app.use('static/css', express.static(path.join(__dirname,"resources","css")))

app.get('/admin/profile',(req, res)=>{
    res.sendFile(path.join(publicDir,"views","admin-profile.html"))
})

module.exports = app