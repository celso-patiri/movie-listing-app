const express = require('express')
const router = express.Router()
const authCheck = require('../services/authCheck')
const getMovies = require('../services/getMovies')
const searchMovies = require('../services/searchMovies')

const Movie = require('../models/movie')
const Profile = require('../models/profile')
const { trusted } = require('mongoose')

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

//Search movie route
router.get('/:profileId/movies/search', authCheck.checkAuthenticated, searchMovies.searchMovies, async (req, res) => { 
    if(profileBelongsToUser(req)){
        res.render('movies/recommended', {
            profileId: req.params.profileId,
            movies: req.movies,
            message: req.greetingMessage
        })
    }else{
        res.redirect('/profiles')
    }   
})

//add movie to watchlist
router.post('/:profileId/movies/watchlist', authCheck.checkAuthenticated, async (req,res) => {
    try{

        if(!await profileBelongsToUser(req)) throw new Error('This Profile does not belong to current User')

        //fetch movie in database if it exists
        const watchedMovie = await Movie.find({
            title: req.body.title,
            profileId: req.params.profileId
        })

        //if movie is already in database
        if(watchedMovie.length > 0){        
            await Movie.findOneAndUpdate({  
                title: req.body.title,     
                profileId: req.params.profileId,
                watched: true               //if movie is already in database as watched
            }, {watched: false})            //add movie to watchlist, change watched to false
            throw `Movie ${req.body.title} is now on watchlist`.toString()
        } 

        //parse genre_ids information to Movie model format
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
        res.redirect(`/profiles/${req.params.profileId}/movies/recommended`)
    }   
})

//get watchlist route
router.get('/:profileId/movies/watchlist', authCheck.checkAuthenticated, async (req,res) => {
    try{
        if(!await profileBelongsToUser(req)) throw new Error('This Profile does not belong to current User')

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
        res.redirect(`/profiles/${req.params.profileId}`)
    }
})

//add movie to watched list
router.post('/:profileId/movies/watched', authCheck.checkAuthenticated, async (req,res) => {
    try{
        if(!await profileBelongsToUser(req)) throw new Error('This Profile does not belong to current User')

        //fetch movie if in database if it exists
        await Movie.findOneAndUpdate({
            title: req.body.title,
            profileId: req.params.profileId,
            watched: false
        },{ watched:true })

    }catch(err){
        console.log(err)
    }finally{
        res.redirect(`/profiles/${req.params.profileId}/movies/watched`)
    }   
})

//get watched movies route
router.get('/:profileId/movies/watched', authCheck.checkAuthenticated, async (req,res) => {
    try{
        if(!await profileBelongsToUser(req)) throw new Error('This Profile does not belong to current User')

        const movies = await Movie.find({
                profileId: req.params.profileId,
                watched: true
        })

        res.render('movies/watched', {
            movies: movies,
            profileId: req.params.profileId,
        })
    }catch(err){
        console.log(err)
        res.redirect(`/profiles/${req.params.profileId}`)
    }
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