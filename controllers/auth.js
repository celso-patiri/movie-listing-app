const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Profile = require('../models/profile')
const passport = require('passport')

router.get('/login', (req, res) => { 
    res.render('auth/login.ejs')             
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true      //error messages defined in passport-config
}))

router.get('/register', (req, res) => { 
    res.render('auth/register.ejs', { errorMessage: null })             
})

//Register new user with a main profile
router.post('/register', async (req, res) => { 
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            dob: req.body.dob
        })
        try{
            User.findOne({ email: user.email }).then(async userExists =>{
                if(userExists){
                    res.render('auth/register', {errorMessage: 'Email already registered'})
                }else{
                    const newUser = await user.save()
                    const mainProfile = new Profile({
                        name: newUser.name,
                        userId: newUser.id
                    })
                    await mainProfile.save()
                    res.redirect(`/login`)
                }
            })
        }catch(err){
            console.log('mongoose: '+err)
        }
    }catch{
        console.log('bcrypt: '+err)
    }
})

router.delete('/logout', (req,res) => {
    req.logOut()
    res.redirect('/login')
})

module.exports = router