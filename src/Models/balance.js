const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BalancePost = new Schema({
    balance: {
        type: Number,
        required: true,
        default: 0,
    }
},
)

module.exports = mongoose.model('BalancePost', BalancePost)
