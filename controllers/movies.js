const express = require('express')
const router = express.Router()
const authCheck = require('../services/authCheck')
const getMovies = require('../services/getMovies')
const searchMovies = require('../services/searchMovies')

const Movie = require('../models/movie')
const Profile = require('../models/profile')

//Recommended movies Route
router.get('/:profileId/movies/recommended', authCheck.checkAuthenticated, getMovies.getMovies, async (req, res) => { 
    
    if(await profileBelongsToUser(req)){
        res.render('movies/recommended', {
            movies: req.movies,
            profileId: req.params.profileId,
            message: req.greetingMessage
        })
    }else{
        res.redirect('/profiles')
    }
})

//add movie to watchlist
router.post('/:profileId/movies/watchlist', authCheck.checkAuthenticated, async (req,res) => {
    try{

        //if profile does not belong to logged in user, exit
        if(!profileBelongsToUser(req)) throw new Error('This Profile does not belong to current User')

        //check if movie is already in watchlist
        const watchedMovie = await Movie.find({
            title: req.body.title,
            profileId: req.params.profileId
        })

        //if movie is already in watch list, exit
        if(watchedMovie.length > 0) throw new Error('Movie already in watchlist')

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
            watched: false,
            profileId: req.params.profileId
        })
        await movie.save()
        
    }catch(err){
        console.log(err)
    }finally{
        res.redirect('recommended')
    }   
})

//get watchlist route
router.get('/:profileId/movies/watchlist', authCheck.checkAuthenticated, async (req,res) => {
    try{

        //if profile does not belong to logged in user, exit
        if(!profileBelongsToUser(req)) throw new Error('This Profile does not belong to current User')

        const movies = await Movie.find({
                profileId: req.params.profileId,
                watched: false
        })

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

//add movie to watched list
router.post('/:profileId/movies/watched', authCheck.checkAuthenticated, async (req,res) => {
   
    //check if movie is already in watchlist
    const watchedMovie = await Movie.find({
        title: req.body.title,
        profileId: req.params.profileId,
    })

    console.log(watchedMoie.watched)

    //if movie is already in watchlist, and is not watched, update it in db with 'watched' status
    if(watchedMovie.length == 1222){

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
            watched: false,
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

//use to limit access to current profile movie routes, to the user associated with the profile
let profileBelongsToUser = async (req) => {
    try{
        const profile = await Profile.findById(req.params.profileId)
        return profile.userId == req.user.id
    }catch{
        return false
    }
}

module.exports = router