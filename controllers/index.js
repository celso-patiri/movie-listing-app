const express = require('express')
const router = express.Router()

router.get('/', checkAuthenticated, (req, res) => { 
    res.render('index.ejs', { name: req.user.name })             //homepage
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        console.log("user is authenticated "+req.body.name)
        return next();
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        returnres.redirect('/')
    }
    next()
}

module.exports = router