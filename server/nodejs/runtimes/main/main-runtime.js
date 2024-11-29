const express = require('express')
const app = express()

const path = require('path')

const publicDir = path.join(__dirname, "..","..","resources")

app.get('/',(req, res)=>{
    res.sendFile(path.join(publicDir,"views","admin-profile.html"))
})