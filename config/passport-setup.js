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
                if (currentUser.amounts.SentMails === undefined) {
                    console.log('problem')
                    User.updateOne({ authID: profile.id }, { amounts: { SentMails: 0, PendingMails: 0, Coins: 15 } }, function(err, res) {
                        // Updated at most one doc, `res.modifiedCount` contains the number
                        // of docs that MongoDB updated
                        console.log('updated!')
                    });
                }

                console.log('user already exists!')
                done(null, currentUser)
            } else {

                // Hvis der ikke blev fundet en bruger som matchede, bliver en ny bruger oprettet :)

                new User({

                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    email: profile.emails,
                    amounts: [{ SentMails: 0, PendingMails: 0, Coins: 15 }],
                    mails: { Sent: [], Pending: [], Drafts: [], Deleted: [] },
                    authID: profile.id,

                    /// -------- \\\

                    authID: profile.id,
    
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    Emails: profile.emails,

                    Amounts: {
                        sentMails: 0, 
                        pendingMails: 0, 
                        coins: 0 
                    },

                    Mails: { 
                        Sent: [], 
                        Pending: [],
                        Drafts: [], 
                        Deleted: [] 
                    },
                    Settings: [
                        {
                            title: "Tema",
                            description: "Vælg dit tema",
                            category: "theme",
                            value: "1",
                            default: "1",
                            type: "bool"
                        }
                    ],
                    History: {
                        Actions: [
                            {
                                title: "Konto oprettet!",
                                description: "Tillykke med din konto",
                                date: "I dag"
                            }
                        ],
                        Transactions: []
                    }

                }).save().then((newUser) => {
                    console.log('new user created!')
                    done(null, newUser)
                })
            }
        })
    })
)