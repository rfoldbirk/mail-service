const router = require('express').Router()
const fs = require('fs')


router.use('/', (req, res) => {
    // handle assets
    let list = []
    console.log(req.url)

    let children = fs.readdirSync(process.env.DIRNAME + '/assets')

    for (const elem of children) // tjekker hvorvidt vores elem er en mappe, og hvis ja, gemmer vi den i variablen: list
        if (fs.lstatSync(process.env.DIRNAME + '/assets' + '/' + elem).isDirectory()) list.push(elem)

    let fileType = req.url.split('/')[1]
    let requestedFile = req.url.split('/')[2]
    console.log(fileType)

    if (list.includes(fileType)) { // hvis den specificerede filtype findes, prøver vi at se om filen findes
        let pathToFile = `${process.env.DIRNAME}/assets/${fileType}/${requestedFile}`
        if (fs.existsSync(pathToFile)) {
            res.sendFile(pathToFile)
            return
        }
    }
    res.send('...') // bare for at sende noget. Men dette betyder altså at der er sket en fejl
})

module.exports = router