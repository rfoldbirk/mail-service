const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    authID: String,

    firstname: String,
    lastname: String,
    Emails: [{ value: String, verified: Boolean }],


    Mails: { 
        Sent: [{
            title: String,
            from: String,
            group_id: String,
            html: String,
            text: String,
            sendWhen: Date
        }], 
        Pending: [Object], // Bare det samme som i Sent
        Drafts: [Object], 
        Deleted: [Object] 
    },
    Groups: [],
    Settings: [],
    History: {
        Actions: [
            {
                title: String,
                description: String,
                date: String
            }
        ],
        Transactions: [
            {
                Title: String,
                Date: Date,
                CashSpent: Number
            }
        ]
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User