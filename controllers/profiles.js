const express = require('express')
const router = express.Router()
const Profile = require('../models/profiles')


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
    renderNewPage(res, new Profile());
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
        // res.redirect(`profiles/${newProfile.id}`)
        res.redirect('profiles')
    }catch{
        renderNewPage(res, profile, true);
    }
})

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

module.exports = router