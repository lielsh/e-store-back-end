require('dotenv').config()
require('./config/db.config')

const express = require('express')
const cors = require('cors')
const fs = require('fs')
const helmet = require('helmet')
const logger = require('morgan')
const path = require('path')
const passport = require('passport')

const publicRouter = require('./routes/public')
const adminRouter = require('./routes/admin')
const imagesRouter = require('./routes/images')
const imagesPaths = require('./middlewares/imagesPaths')
const privateRouter = require('./routes/private')
const emailRouter = require('./routes/emails')

const app = express()
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

// view engine setup for erros
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(helmet())
app.use(cors())
app.use(logger('tiny', { stream: accessLogStream }))
app.use(logger('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
    next()
})

app.use('/', publicRouter)
app.use('/admin', adminRouter)
app.use('/images/:path', imagesPaths, imagesRouter)
app.use('/users', privateRouter)
app.use('/emails', emailRouter)

module.exports = app