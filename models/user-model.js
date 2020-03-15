const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    oauthID: String,
    email: [{value: String, verified: Boolean}],
    chosenEmail: Number,
    newProfile: Boolean,
    subscription: String
})

const User = mongoose.model('user', userSchema)

module.exports = User