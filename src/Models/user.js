const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserPost = new Schema({
    name:{
        type:String,
        required: true,
    },
    studentId: {
        type: String,
        required: true,
        max:5,
        min:5,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('UserPost', UserPost)
