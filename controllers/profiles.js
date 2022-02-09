const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')
const authCheck = require('../services/authCheck')

//All profiles Route
router.get('/', authCheck.checkAuthenticated, async (req, res) => {
    try{
        const profiles = await Profile.find({userId: req.user.id})
        res.render('profiles/index', {
            profiles: profiles,
            errorMessage: null
        })             
    } catch (err){
        console.log(err)
        res.redirect('/')
    } 
})

//New profile route
router.get('/new', authCheck.checkAuthenticated, async (req,res) => {
    const profiles = await Profile.find({ userId: req.user.id })
    if(profiles.length > 3){
        res.render('profiles', {
            profiles: profiles, 
            errorMessage: 'Only 4 profiles are allowed for each user'
        })
    }else{
        res.render('profiles/new', { profile: new Profile() })
    }
})

//Create profile route
router.post('/new', authCheck.checkAuthenticated, async (req,res) => {
    const profile = new Profile({
        name: req.body.name,
        userId: req.user.id
    })
    try{
        const newProfile = await profile.save();
        res.redirect(`/profiles/${newProfile.id}`)
    }catch{
        res.redirect(`/profiles`)
    }
})

//get profile by id
router.get('/:id', authCheck.checkAuthenticated, async (req, res) => {
    try{
        const profile = await Profile.findById(req.params.id)

        if(req.user.id != profile.userId)
            throw new Error('Profile is not associated with current user')
        
        res.render('profiles/show', {profile: profile})
    }catch(err){
        console.log(err)
        res.redirect('/profiles')
    }
})

//edit profile by id
router.get('/:id/edit', authCheck.checkAuthenticated, async (req,res) => {
    try{
        const profile = await Profile.findById(req.params.id)

        if(req.user.id != profile.userId)
            throw new Error('Profile is not associated with current user')

        res.render('profiles/edit', { profile: profile })
    }catch(err){
        console.log(err)
        res.redirect('/profiles')
    }
})

//update profile
router.put('/:id', authCheck.checkAuthenticated, async (req,res) => {
    try{
        await Profile.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user.id   
        }, {
            name: req.body.name
        })
        res.redirect(`/profiles/${req.params.id}`)
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
})

//delete profile
router.delete('/:id', authCheck.checkAuthenticated, async (req,res) => {
    try{
        await Profile.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id   
        })
        res.redirect('/profiles')
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
})

module.exports = router