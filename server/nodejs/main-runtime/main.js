const express = require('express')
const main = express()

const path = require('path')

const publicDir = path.join(__dirname, "resources")

//Middleware that exposes the css resources statically
main.use('/static/css', express.static(path.join(__dirname,"resources","css")))

//Middleware that exposes the js resources statically
main.use('/static/js',express.static(path.join(__dirname,"resources","js")))

main.use(`/static/images`,express.static(path.join(__dirname,"resources","images")))


module.exports = main