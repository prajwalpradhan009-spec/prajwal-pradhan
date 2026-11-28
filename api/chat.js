const express = require('express')
const { registerChatRoutes } = require('../backend/chat')
const app = express()
app.set('trust proxy', 1)
registerChatRoutes(app)
module.exports = app
