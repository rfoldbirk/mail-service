const router = require('express').Router()
const passport = require('passport')

const renderContent = require('../renderContent')

// auth login

// signup
router.get('/signup', (req, res) => {

})

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout()
    res.redirect('/auth/login')
})

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
}))

// callback
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile')
})


router.get('*', (req, res) => {
    if (req.user) {
        res.redirect('/profile/dashboard')
        return
    }

    res.redirect('/')
})

module.exports = router
