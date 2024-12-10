const express = require('express')
const app = express();

app.use(express.json());

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