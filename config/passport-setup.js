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

                    authID: profile.id,
    
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    Emails: profile.emails,

                    Mails: { 
                        Sent: [], 
                        Pending: [],
                        Drafts: [], 
                        Deleted: [] 
                    },
                    Groups: [],
                    Settings: [
                        {
                            title: "Tema",
                            description: "Vælg dit tema",
                            category: "Udseende",
                            Option: {
                                value: 0,
                                default: 0,
                                type: "choose"
                            }
                        },
                        {
                            title: "Abonnement",
                            description: "Her kan du vælge dit abonnement",
                            category: "Abonnement",
                            Option: {
                                value: 0,
                                default: 0,
                                type: "choose"
                            }
                        }
                    ],
                    History: {
                        Actions: [
                            {
                                title: "Konto oprettet!",
                                description: "Tillykke med din konto",
                                date: getDateTime()
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


function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    // return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    return `${day}/${month}/${year} - ${hour}:${min}`

}