const express = require('express')
const router = express.Router()
const authCheck = require('../services/authCheck')
const getMovies = require('../services/getMovies')
const searchMovies = require('../services/searchMovies')

const Movie = require('../models/movie')
const Profile = require('../models/profile')

//Recommended movies Route
router.get('/:profileId/movies/recommended', authCheck.checkAuthenticated, getMovies.getMovies, async (req, res) => { 
    // res.render('movies/recommended', { movies: movies.results, profileId: req.params.profileId })
    res.render('movies/recommended', {
        movies: req.movies,
        profileId: req.params.profileId,
        message: req.greetingMessage
    })

})

//add movie to watchlist
router.post('/:profileId/movies/watchlist', authCheck.checkAuthenticated, async (req,res) => {
   
    //check if movie is already in watchlist
    const watchedMovie = await Movie.find({
        title: req.body.title,
        profileId: req.params.profileId
    })

    //if movie is not already in watch list, save movie in db
    if(watchedMovie.length == 0){

        //parse genre_ids information to Movie mongoose model format
        const genres = req.body.genre_ids.split(',') 
        let genre_ids = []
        for(let genre of genres){
            genre_ids.push({id: genre})
        }
    
        const movie = new Movie({
            title: req.body.title,
            overview: req.body.overview,
            poster_path: req.body.poster_path,
            genres: genre_ids,
            profileId: req.params.profileId
        })
        try{
            await movie.save()
        }catch(err){
            console.log(err)
        }
    }
    res.redirect('recommended')
})

//get watchlist route
router.get('/:profileId/movies/watchlist', authCheck.checkAuthenticated, async (req,res) => {
    try{
        const movies = await Movie.find({ profileId: req.params.profileId })
        res.render('movies/watchlist', {
            movies: movies,
            profileId: req.params.profileId,
        })
    }catch(err){

        console.log(err)
        res.redirect('/profiles/:profileId')
    }
})

//Search movie route
router.get('/:profileId/movies/search', authCheck.checkAuthenticated, searchMovies.searchMovies, async (req, res) => { 
        res.render('movies/recommended', {
            profileId: req.params.profileId,
            movies: req.movies,
            message: req.greetingMessage
        })
    }
)



module.exports = router