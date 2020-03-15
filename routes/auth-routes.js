const router = require('express').Router()
const passport = require('passport')

// auth login
router.get('/login', (req, res) => {
    res.render('pages/login')
})

// signup
router.get('/signup', (req, res) => {

})

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout()
    res.redirect('../../auth/login')
})

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
}))

// callback
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    if (req.user.newProfile) {
        res.redirect('../../profile/signup')
    } else if (req.user.chosenEmail == -1) {
        res.redirect('../../profile/settings')
    } else {
        res.redirect('../../profile/dashboard')
    }
})


router.get('*', (req, res) => {
    if (req.user) {
        res.redirect('../../profile/dashboard')
        return
    }

    res.render('pages/home')
})

module.exports = router
