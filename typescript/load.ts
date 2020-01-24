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


    /*

    Dette script gør virkelig ikke andet end at loade dependencies
    Jeg syntes det fyldte lidt for meget i den rigtige fil


    */

    const fs = require('fs')
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser')
    const http = require('http')
    const https = require('https')
    const privateKey  = fs.readFileSync(path + '/server_stuff/junk/certificate.key', 'utf8')
    const certificate = fs.readFileSync(path + '/server_stuff/junk/certificate.crt', 'utf8')

    var credentials = {key: privateKey, cert: certificate}
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
        privateKey: privateKey,
        certificate: certificate,
        credentials: credentials,
        web: web
    }
}