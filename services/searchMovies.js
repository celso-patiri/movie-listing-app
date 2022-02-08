const axios = require('axios')
const Movie = require('../models/movie')

const API_URL = 'https://api.themoviedb.org/3/'

const searchMovies = async (req, res, next) => {

    const query = encodeURIComponent(req.query.query)
    const url = `${API_URL}search/movie?api_key=${process.env.API_KEY}&query=${query}`

    try{
        const moviedbResponse = await axios.get(url)
        let movies = moviedbResponse.data
        req.movies = movies.results
        req.greetingMessage = (req.movies.length > 0)? "Search Results" : "No movies found"

    }catch(err){
        console.log(err)
    }finally{
        next()
    }
}

module.exports = {
    searchMovies
}