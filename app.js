require("dotenv").config()
const cors = require('cors')
const express = require("express")
const app = express()
const morgan = require('morgan')
const client = require('./db/client')
client.connect()

// Setup your Middleware and API Router here

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
const apiRouter = require('./api')
app.use('/api', apiRouter)



module.exports = app;
