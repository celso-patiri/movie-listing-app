const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')


//All movies Route
router.get('/', async (req, res) => { 
    res.send('All Movies')
})

//New movie route
router.get('/new', (req,res) => {
    res.send('New Movie')
})

//Create movie route
router.post('/', async (req,res) => {
    const movie = new Movie({
        title: req.body.title,
        overview: req.body.overview,
        genres: req.body.genres,
        poster_path: req.body.poster_path
    })
    try{
        const newMovie = await movie.save()
        // res.redirect(`movies/${newMovie.id}`)
        res.redirect('movies')
    }catch{
        res.render('movies/new', {
            movie: movie,
            errorMessage: 'Error creating movie'
        })
    }
})

module.exports = router