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
    genres:[{ id: Number, name: String }],
    poster_path: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Movie', movieSchema)