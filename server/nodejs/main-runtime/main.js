const express = require('express')
const {authorize} = require('./middleware/auth')
const main = express()
const adminRoutes= require('./services/resource-service/routes/admin-routes')

const path = require('path')
const publicDir = (path.join(__dirname, "../resources"))

//Middleware that exposes resources statically
main.use('/static/css', express.static(path.join(publicDir, 'css')));
main.use('/static/fonts', express.static(path.join(publicDir, 'fonts')));
main.use('/static/images', express.static(path.join(publicDir, 'images')));
main.use('/static/js', express.static(path.join(publicDir, 'js')));

//Use the admin routes
main.use(adminRoutes)


main.get('/', (req, res) => {
    const htmlPath = path.join(publicDir, "index.html")
    res.sendFile(htmlPath)
})
//Sample use of middleware
main.use('/:token',authorize, async(req,res)=>{
    res.status(200).json({message:"success"})
})


module.exports = main