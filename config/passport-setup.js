const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/user-model')


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id , done) => {
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
        console.log(profile.emails)
        // tjekker lige om brugeren findes først
        User.findOne({oauthID: profile.id}).then((currentUser) => {
            if (currentUser) {
                // jeg har allerede brugeren
                console.log('user already exists :', currentUser)
                done(null, currentUser)
            } else {
                // den findes ikke, og jeg opretter brugeren

                new User({
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    oauthID: profile.id,
                    email: profile.emails,
                    chosenEmail: -1,
                    newProfile: true,
                    subscription: 'null'
                }).save().then((newUser) => {
                    console.log('new user created:', newUser)
                    done(null, newUser)
                })
            }
        }) 
    })
)
