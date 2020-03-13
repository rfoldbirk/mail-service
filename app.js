console.clear()

require('dotenv').config()

// set global dirname
let slash = (process.platform == 'win32') ? '\\':'/'
let split_dirname = __dirname.split(slash)

while (split_dirname[split_dirname.length-1] != process.env.FOLDER_NAME)
    split_dirname.pop()

process.env.DIRNAME = split_dirname.join('/')

// const fs = require('fs')
const express = require('express')
const authRoutes = require('./routes/auth-routes')
const assetsRoutes = require('./routes/assets-routes')
const homeRoutes = require('./routes/home-routes')
const app = express()


// set up view engine
app.set('view engine', 'ejs')

// set up routes
app.use('/auth', authRoutes)
app.use('/assets', assetsRoutes)
app.use('/', homeRoutes) // also takes care of the default path

app.listen(Number(process.env.HTTP), () => {
    console.log(`listening on port: ${process.env.HTTP}`)
})