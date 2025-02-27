const express = require('express')
const cors = require('cors')
const app = express();

const dalRoutes = require(`./services/dal-service`)
app.use('/api', dalRoutes)

const authRoutes = require(`./services/auth-service`)
app.use('/api/auth',authRoutes)

const uploadDownloadService = require(`./services/upload-download-service`)
app.use('/api/upload-download', uploadDownloadService)

app.get('/',(req,res) => {
    res.send("This is the API endpoint")
})

module.exports = app