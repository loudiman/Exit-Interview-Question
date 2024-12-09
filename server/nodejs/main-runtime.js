const express = require('express')
const app = express()

const path = require('path')

const publicDir = path.join(__dirname, "resources")

// Middleware that exposes the CSS resources statically
app.use('/static/css', express.static(path.join(publicDir, "css")));

// Middleware that exposes the JS resources statically
app.use('/static/js', express.static(path.join(publicDir, "js")));

module.exports = app;