const router = require('express').Router()
const renderContent = require('../renderContent')

function checkUser(req, res) { // tjekker om brugeren er logget ind
    if (!req.user) {
        res.redirect('../auth/login')
        return true
    }

    return false
}

const valid_pages = ['/settings', '/history', "/groups"] // skal starte med: '/'

router.use('/', (req, res) => {
    if (checkUser(req, res)) return


    if (valid_pages.includes(req.url)) {
        
        const content = './bodies' + req.url
        renderContent(req, res, 'Mail Service', content, req.user)
        return
    }

    res.redirect('/')
})

module.exports = router
