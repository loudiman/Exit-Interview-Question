const express = require('express')
const cors = require('cors')
const app = express();

const corsOptions = {
    origin: '*' // This is a temp fix, for production running this server through a proxy should bypass cors
}

app.use(cors(corsOptions))

const dalRoutes = require(`./services/dal-service`)
app.use('/api', dalRoutes)

const authRoutes = require(`./services/auth-service`)
app.use('/auth',authRoutes)

const uploadDownloadService = require(`./services/upload-download-service`)
app.use('/upload-download',uploadDownloadService)

app.get('/',(req,res) => {
    res.send("This is the API endpoint")
})


module.exports = app