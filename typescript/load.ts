export function load(): object {
    // -------------------------------------------------
    var currentPath: string[] = __dirname.split('/')
    const lengthOfPath: number = currentPath.length - 1
    currentPath.splice(lengthOfPath, 1)
    const path: string = currentPath.join('/')
    // Jeg lavede det her fordi, når jeg skrev __dirname
    // ville jeg ikke kunne få fat i server_stuff
    // mappen... :(
    // -------------------------------------------------

    const fs = require('fs')
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser')
    const http = require('http')
    const https = require('https')
    const privateKey  = fs.readFileSync(path + '/server_stuff/junk/certificate.key', 'utf8')
    const certificate = fs.readFileSync(path + '/server_stuff/junk/certificate.crt', 'utf8')

    var credentials = {key: privateKey, cert: certificate}
    var express = require('express')
    var app = express()

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cookieParser())

    var httpServer = http.createServer(app)
    var httpsServer = https.createServer(credentials, app)

    httpServer.listen(8080)
    httpsServer.listen(8443)

    return {
        fs: fs,
        bodyParser: bodyParser,
        cookieParser: cookieParser,
        http: http,
        https: https,
        privateKey: privateKey,
        certificate: certificate,
        credentials: credentials,
        app: app
    }
}