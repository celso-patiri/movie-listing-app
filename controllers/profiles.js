const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')
const authCheck = require('../auth/authCheck')

//All profiles Route
router.get('/', authCheck.checkAuthenticated, async (req, res) => {
    let searchOptions = {}
    if((req.query.name != null && req.query.name !== '')){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    //talvez tirar search option
    try{
        const profiles = await Profile.find({userId: req.user.id})
        res.render('profiles/index', {
             profiles: profiles
            //  searchOptions: req.query
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
            errorMessage: 'Each user can have a max of 4 profiles'
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
        res.render('profiles/show', {profile: profile})
    }catch{
        res.redirect('/profiles')
    }
})

//edit profile by id
router.get('/:id/edit', authCheck.checkAuthenticated, async (req,res) => {
    try{
        const profile = await Profile.findById(req.params.id)
        res.render('profiles/edit', { profile: profile })
    }catch{
        res.redirect('/profiles')
    }
})

//update profile
router.put('/:id', authCheck.checkAuthenticated, async (req,res) => {
    let profile;
    try{
        profile = await Profile.findById(req.params.id)
        if(profile.userId == req.user.id){
            profile.name = req.body.name
            await profile.save();
        }
        res.redirect(`/profiles/${profile.id}`)
    }catch{
        if(profile == null) res.redirect('/')
    }
})

//delete profile
router.delete('/:id', authCheck.checkAuthenticated, async (req,res) => {
    let profile;
    try{
        profile = await Profile.findById(req.params.id)
        if(profile.userId == req.user.id){
            await profile.remove();
        }
        res.redirect('/profiles')
    }catch{
        if(profile == null) res.redirect('/')
        else{
            res.redirect(`/profiles/${profile.id}`)
        }
    }
})

module.exports = router