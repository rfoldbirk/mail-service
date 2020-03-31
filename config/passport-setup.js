const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/user-model')


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        // options for the strategy
        callbackURL: '/auth/google/redirect',
        clientID: process.env.API_GOOGLE_CLIENT_ID,
        clientSecret: process.env.API_GOOGLE_CLIENT_SECRET
    }, (accessToken, refreshToken, profile, done) => {
        // callback, which is fired under the authentication process

        // tjekker lige om brugeren findes først

        User.findOne({ authID: profile.id }).then((currentUser) => {

            if (currentUser) {
                // jeg har allerede brugeren
                console.log('user already exists!')
                done(null, currentUser)
            } else {

                // Hvis der ikke blev fundet en bruger som matchede, bliver en ny bruger oprettet :)

                new User({

                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    email: profile.emails,
                    amountOfMails: 5,
                    authID: profile.id

                }).save().then((newUser) => {
                    console.log('new user created!')
                    done(null, newUser)
                })
            }
        })
    })
)