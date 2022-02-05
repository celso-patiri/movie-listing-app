const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')

async function renderNewPage(res, profile, hasError = false){
    try{
        //const User = await Users.find() - #aula3 10:50 //pegar id do user logado
        const profile = new Profile() 
        const params = {
            profile: profile
            //userid: user
        }
        if(hasError)    params.errorMessage = 'Error creating profile'
        res.render('profiles/new', params)
    }catch{
        res.redirect('/profiles')
    }
}

//All profiles Route
router.get('/', async (req, res) => { 
    let searchOptions = {}
    if((req.query.name != null && req.query.name !== '')){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const profiles = await profile.find(searchOptions)
        res.render('profiles/index', {
             profiles: profiles,
             searchOptions: req.query
        })             
    } catch {
        res.redirect('/')
    } 
})

//New profile route
router.get('/new', async (req,res) => {
    // renderNewPage(res, new Profile());
    res.render('profiles/new', { profile: new Profile() })
})

//Create prfile route
router.post('/', async (req,res) => {
    const profile = new Profile({
        name: req.body.name,
        //userId: pegar id do user logado -- erro tentando salvar sem isso
    })
    console.log(profile.name)
    try{
        const newProfile = await profile.save();
        // res.redirect(`/profiles/${newProfile.id}`)
        res.redirect('/profiles')
    }catch{
        //Change error true to "error updating profile"
        renderNewPage(res, profile, true);
    }
})

//get profile by id
router.get('/:id', async (req, res) => {
    res.send('Show Profile: '+ req.params.id)
    //fazer primeiro getById for user
})

//edit profile by id
router.get('/:id/edit', async (req,res) => {
    try{
        const profile = await Profile.findById(req.param.id)
        res.render('profiles/edit', { profile: profile })

    }catch{
        res.redirect('/profiles')
    }
})

//update profile
router.put('/:id', async (req,res) => {
    let profile;
    try{
        profile = await Profile.findById(req.params.id)
        profile.name = req.body.name
        await profile.save();
        res.redirect(`/profiles/${profile.id}`)
    }catch{
        if(profile == null) res.redirect('/')
        renderNewPage(res, profile, true);
    }
})

//delete profile
router.delete('/:id', async (req,res) => {
    let profile;
    try{
        profile = await Profile.findById(req.params.id)
        await profile.remove();
        res.redirect('/profiles')
    }catch{
        if(profile == null) res.redirect('/')
        else{
            res.redirect(`/profiles/${profile.id}`)
        }
    }
})

module.exports = router