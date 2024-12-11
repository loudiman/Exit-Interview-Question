const express = require('express')
const main = express()
const adminRoutes= require('./services/resource-service/routes/admin-routes')

const path = require('path')

const publicDir = path.join(__dirname, "../resources")

//Middleware that exposes the css resources statically
main.use('/static/css', express.static(path.join(publicDir,"css")))

//Middleware that exposes the js resources statically
main.use('/static/js',express.static(path.join(publicDir,"js")))

main.use(`/static/images`,express.static(path.join(publicDir,"images")))

//user the admin routes
main.use(adminRoutes)
main.use(creationRoutes)

main.get('/', (req, res) => {
    const htmlPath = path.join(publicDir, 'views', 'index.html')
    res.sendFile(htmlPath)
})

module.exports = main