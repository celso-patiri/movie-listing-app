const express = require('express')
const router = express.Router()
const authCheck = require('../auth/authCheck')

router.get('/', authCheck.checkAuthenticated, (req, res) => { 
    res.render('index.ejs', { name: req.user.name })             //homepage
})

module.exports = router