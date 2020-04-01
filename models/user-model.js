const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: [{ value: String, verified: Boolean }],
    amounts: { SentMails: Number, PendingMails: Number, Coins: Number },
    mails: [{ Sent: Object, Pending: Object, Drafts: Object, Deleted: Object }],
    authID: String
})

const User = mongoose.model('user', userSchema)

module.exports = User