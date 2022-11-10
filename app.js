require("dotenv").config()
const cors = require('cors')
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
app.use(cors())

const apiRouter = require('./api')
app.use('/api', apiRouter)

const {client} = require('./db')
client.connect()

module.exports = app;
