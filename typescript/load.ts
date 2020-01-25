export function load(): object {
    /*

    Dette script gør virkelig ikke andet end at loade dependencies
    Jeg syntes det fyldte lidt for meget i den rigtige fil (app.ts)

    */

    const fs = require('fs')
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser')
    const http = require('http')
    const https = require('https')

    var credentials = {key: "", cert: ""}
    var express = require('express')
    var web = express()

    web.use(bodyParser.urlencoded({ extended: false }))
    web.use(bodyParser.json())
    web.use(cookieParser())

    var httpServer = http.createServer(web)
    var httpsServer = https.createServer(credentials, web)

    httpServer.listen(8080)
    httpsServer.listen(8443)

    return {
        fs: fs,
        bodyParser: bodyParser,
        cookieParser: cookieParser,
        http: http,
        https: https,
        credentials: credentials,
        web: web
    }
}
