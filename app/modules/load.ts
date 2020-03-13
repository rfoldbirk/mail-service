
function onLoadLog(message): void {
    console.clear()
    console.log(message)
}

let global_libraries = {
    "fs": null
}

export function load(message: string): object {
    onLoadLog(message)

    require('dotenv').config()

    let slash: string = '/'

    if (process.platform == 'win32')
        slash = '\\'

    let path: string[] = __dirname.split(slash)

    while (path[path.length - 1] != process.env.FOLDER_NAME) {
        path.pop()
    }

    const dirname: string = path.join('/')

    const fs: any = require('fs')
    const bodyParser: any = require('body-parser')
    const cookieParser: any = require('cookie-parser')
    const mysql = require('mysql')

    var con = mysql.createConnection({
        host: "172.20.10.6",
        user: "root",
        password: "root"
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });

    const express = require('express')
    const app = express()
    const http = require('http')
    const https = require('https')

    const httpServer = http.createServer(app)
    const httpsServer = https.createServer({ key: '', cert: '' }, app)

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cookieParser())

    httpServer.listen(Number(process.env.HTTP_PORT))
    httpsServer.listen(Number(process.env.HTTPS_PORT))

    return {
        "fs": fs,
        "app": app,
        "dirname": dirname
    }
}