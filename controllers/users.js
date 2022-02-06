const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Profile = require('../models/profile')
const authCheck = require('../auth/authCheck')

//All users Route
router.get('/', async (req, res) => { 
    let searchOptions = {}
    if((req.query.name != null && req.query.name !== '')){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    if((req.query.email != null && req.query.email !== '')){
        searchOptions.email = new RegExp(req.query.email, 'i')
    }
    try{
        const users = await User.find(searchOptions)
        res.render('users/index', {
             users: users,
             searchOptions: req.query
        })             //
    } catch {
        res.redirect('/')
    } 
})


//TO ACHANDO QUE ESSES DOIS METODOS AQUI EM BAIXO VAO DE BASE 
//CRIAR USER EH RESPONSABILIDADE DO REGISTER
//New user route
router.get('/new', (req,res) => {
    res.render('users/new', { user: new User() })
})

//Create user route
router.post('/', async (req,res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dob: req.body.dob
    })
    try{
        const newUser = await user.save()
        // res.redirect(`/users/${newUser.id}`)
        res.redirect('users')
    }catch{
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating User'
        })
    }
})

//get by id
router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const profiles = await Profile.find({ user: user.id }).exec() //check exec
        res.render('users/show', {
            user: user,
            profiles: profiles
        })
    }catch(err){
        console.log(err)
        //ta caindo aqu sempre
        res.redirect('/')
    }
})

//edit user by id
router.get('/:id/edit', authCheck.checkAuthenticated, async (req,res) =>{
    try{
        const user = User.findById(req.params.id)
        res.render('users/new', { user: user })
    }catch{
        res.redirect('/users')
    }
})

//update user by id
router.put('/:id', async (req,res) =>{
    let user
    try{
        user = await User.findById(req.params.id)
        user.name = req.body.name
        user.email = req.body.email
        user.dob = req.body.dob
        await user.save()
        // res.redirect(`/users/${user.id}`)
        res.redirect('/users')
    }catch{ 
        if(user == null) res.redirect('/')
        else{
            res.render('users/edit', {
                user: user,
                errorMessage: 'Error updating User'
            })
        }
    }
})

//delete user by id
router.delete('/:id', async (req,res) =>{
    let user
    try{
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/users')
    }catch{ 
        if(user == null) res.redirect('/')
        else{
            res.redirect(`/users/${user.id}`)
        }
    }
})

module.exports = router