const axios = require('axios')
const Movie = require('../models/movie')

const API_URL = 'https://api.themoviedb.org/3/'
const API_KEY = 'e6f37273b4d55b9eba693a8600e3c957'
const movieByGenre = `${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`

let message;

const getMovies = async (req, res, next) => {
    const moviesWatched = await Movie.find({ profileId: req.params.profileId })

    let movies
    if(moviesWatched.length > 0) {
        movies = await getRecommendedMovies(req.params.profileId) 
    }else{
        movies = await getRandomMovies() 
    } 
    req.movies = movies.results
    req.greetingMessage = message
    next()
}

const getRandomMovies = async () => {
    const page = Math.random()*500
    const url = `${API_URL}discover/movie?api_key=${API_KEY}&page=${page}`
    const moviedbResponse = await axios.get(url)

    message = "Random movies"
    return moviedbResponse.data
}

const getRecommendedMovies = async (profileId) => {

    //api request to get names of the genres
    const genresURL = `${API_URL}genre/movie/list?api_key=${API_KEY}`
    const moviedbGenresResponse = await axios.get(genresURL)

    //populate map with names
    const genreNames = new Map();
    moviedbGenresResponse.data.genres.forEach(genre => {
        genreNames.set(genre.id, genre.name);
    })

    //get movies watched by this profile
    const watchedMovies = await Movie.find({ profileId: profileId })

    //populate map with (genre, timesWatched)
    const genresWatched = new Map();
    watchedMovies.forEach(movie => {
        movie.genres.forEach(genre => {
            if(genresWatched.has(genre.id)){
                genresWatched.get(genre.id).val++
            }else{
                genresWatched.set(genre.id, {val: 1})
            }
        })
    })

    //sort genres by most watched into an array
    const sortedGenres = [...genresWatched.entries()].sort((a, b) => b[1].val - a[1].val);
    let genresParameter = sortedGenres[0][0]                    //genres parameter used in url for api request                                    
    message = "Recommended " + genreNames.get(sortedGenres[0][0])   //message with movie genre names sent on req 

    if(sortedGenres.length > 1){                                
        genresParameter += ',' + sortedGenres[1][0]             //if it exists, add second genre to url
        message += ', ' + genreNames.get(sortedGenres[1][0])        //if it exists, add second genre to message
    }
    if(sortedGenres.length > 2){
        genresParameter += ',' + sortedGenres[2][0]             //if it exists, add third genre to url
        message += ', ' + genreNames.get(sortedGenres[2][0])        //if it exists, add third genre to message
    }

    //get movies based on genres
    const url = `${API_URL}discover/movie?api_key=${API_KEY}&with_genres=${genresParameter}`
    const moviedbResponse = await axios.get(url)

    message += " Movies"
    return moviedbResponse.data
}

module.exports = {
    getMovies,
    getRandomMovies,
    getRecommendedMovies
}