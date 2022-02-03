const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    }


})

module.exports = mongoose.model('User', userSchema)