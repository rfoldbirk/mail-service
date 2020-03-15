const router = require('express').Router()

function checkUser(req, res) { // tjekker om brugeren er logget ind
    if (!req.user) {
        res.redirect('../auth/login')
        return true
    }

    return false
}

const valid_pages = ['/dashboard', '/signup', '/settings']

router.use('/', (req, res) => {
    if (checkUser(req, res)) return

    console.log(req.user.email)

    if (valid_pages.includes(req.url)) {
        if (req.url == '/settings') {
            if (req.user.newProfile) {
                res.render('pages/profile/signup', {user: req.user})
                return
            }
        }
        res.render(`pages/profile${req.url}`, {user: req.user})
        return
    }

    res.redirect('./dashboard')
})

module.exports = router
