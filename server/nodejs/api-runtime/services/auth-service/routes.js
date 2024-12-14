const express = require('express')
const { tokenGeneration, tokenAuthorization, tokenAuthorizationV2, tokenGenerationV2 } = require('./controller')
const authRoutes = express.Router()

authRoutes.get('/generate', tokenGenerationV2)

authRoutes.get('/authorize', tokenAuthorizationV2)

module.exports = authRoutes