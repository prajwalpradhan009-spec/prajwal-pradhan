const express = require('express')
const { registerGitHubRoutes } = require('../backend/github')
const app = express()
registerGitHubRoutes(app)
module.exports = app
