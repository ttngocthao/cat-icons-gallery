const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

if(process.env.NODE_ENV!=='test'){
    mongoose.connect(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(()=>{logger.info('Connected to MongoDB')})
    .catch(()=>{ logger.error('error in connecting to MongoDB')})
}





app.use(cors())
//app.use(express.static('build'))
app.use(express.json())

app.use(middleware.requestLogger)
app.use('/api/blogs',blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app