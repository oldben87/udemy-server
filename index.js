const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const router = require('./router')
const config = require('./.env/config')

// Database Setup
const mongoUri = `mongodb+srv://admin1:${config.mongo_pw}@cluster0.jrrh7.gcp.mongodb.net/udemyTest?retryWrites=true&w=majority`
mongoose.connect(mongoUri).catch((err) => console.log(err))

// App Setup -> express to external
const app = express()
app.use(morgan('combined')) // logging framework
app.use(bodyParser.json({ type: '*/*' }))
router(app)

// Server Setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log('Server listening on port: ' + port)
