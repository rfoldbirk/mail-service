const router = require('express').Router()
const renderContent = require('../renderContent')
const User = require('../models/user-model')

router.post('/opretGruppe', (req, res) => {
    if (req.user) {
        console.log(req.user.id)
        User.findOne({ authID: req.user.id }).then((currentUser) => {

            if (currentUser) {
                // jeg har allerede brugeren
                console.log('user already exists!')
            }
        })

        res.send({res: false, why: "gname:exists"})
    } else {
        res.send('Du skal logge ind')
    }
})


module.exports = router