const express = require('express')
const { tokenGeneration, tokenAuthorization, tokenAuthorizationV2, tokenGenerationV2 } = require('./controller')
const authRoutes = express.Router()
const session = require('express-session')

// Configure the session middleware
authRoutes.use(session({
    secret: 'mySecretKey',   // Secret to sign session ID cookie
    resave: false,           // Do not resave session if not modified
    saveUninitialized: true, // Save session even if not initialized
    cookie: { secure: false } // For non-HTTPS use false, for HTTPS set to true
}));

authRoutes.get('/generate', tokenGenerationV2)

authRoutes.get('/authorize', tokenAuthorizationV2)

module.exports = authRoutes