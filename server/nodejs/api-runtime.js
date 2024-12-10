const express = require('express')
const cors = require('cors')
const app = express();

const corsOptions = {
    origin: '*' // This is a temp fix, for production running this server through a proxy should bypass cors
}

app.use(cors(corsOptions))

const dalRoutes = require(`./services/dal-service`)

const dalRoutes = require(`./services/dal-service`)
app.use('/api', dalRoutes)

const surveyRoutes = require(`./services/resource-service/routes/survey-routes`)
app.use('/api', surveyRoutes)



app.get('/',(req,res) => {
    res.send("This is the API endpoint")
})

app.listen(2019, () => {
    console.log("API Server is Running")
})

module.exports = app