require('dotenv').config()

// set global dirname
let slash = (process.platform == 'win32') ? '\\' : '/'
let split_dirname = __dirname.split(slash)

while (split_dirname[split_dirname.length - 1] != process.env.FOLDER_NAME)
    split_dirname.pop()

process.env.DIRNAME = split_dirname.join('/')

// const fs = require('fs')
const express = require('express')

// routes
const authRoute = require('./routes/auth-routes')
const assetsRoute = require('./routes/assets-routes')
const profileRoute = require('./routes/profile-routes')

const app = express()

const passport = require('passport')
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')

const renderContent = require('./renderContent')

// set up view engine
app.set('view engine', 'ejs')


// cookieSession setup
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // en dag
    keys: [process.env.COOKIE_KEY]

}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// connect to mongodb
mongoose.connect(process.env.MONGODB, () => {
    console.clear()
    console.log('connected to mongo db')
})

// set up routes
app.use('/auth', authRoute)
app.use('/assets', assetsRoute)
app.use('/profile', profileRoute)


app.get('*', (req, res) => {
    if (req.session._ctx.headers.host.includes('api.')) {
        // api håndtering :9
    }
    
    renderContent(req, res, 'Mail Service')
})

app.listen(Number(process.env.HTTP), () => {
    console.log(`listening on port: ${process.env.HTTP}`)
})