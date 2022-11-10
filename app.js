require("dotenv").config()
const cors = require('cors')
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
app.use(cors())

module.exports = app;
