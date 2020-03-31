const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: [{ value: String, verified: Boolean }],
    amountOfMails: Number,
    authID: String
})

const User = mongoose.model('user', userSchema)

module.exports = User