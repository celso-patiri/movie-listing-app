const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    genres:[
        { id: Number }
    ],
    poster_path: {
        type: String,
        required: true
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    }
})

module.exports = mongoose.model('Movie', movieSchema)