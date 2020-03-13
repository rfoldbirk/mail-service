const router = require('express').Router()

router.use('/', (req, res) => {
    let list = ['dashboard', 'write', 'drafts', 'sent']

    for (const elem of list) {
        if (req.url == '/' + elem) {
            res.render('pages/home', {loggedin: true, active: elem.toLowerCase()})
            return
        }
    }

    res.render('pages/home', {loggedin: true}) // jeg burde virkelig tjekke hvorvidt brugeren er logget ind eller ej
})

module.exports = router