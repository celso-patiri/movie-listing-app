if(process.env.NODE_ENV !== 'production'){  //NODE_ENV loaded automatically by Node 
    require('dotenv').config()              //load env variables into process.env
}

const express = require('express')
const app = express()

const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const authRouter = require('./controllers/auth')
const indexRouter = require('./controllers/index')  //referecing routes on server
const userRouter = require('./controllers/users')  //referecing routes on server
const movieRouter = require('./controllers/movies')  //referecing routes on server
const profileRouter = require('./controllers/profiles')  //referecing routes on server

const User = require('./models/user')
const passport = require('passport')                        //used to handle user auth during session 
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./config/passport-config')     //passport module configuration

 initializePassport(                                         //function find user based on email
    passport, 
    email  => getUserByEmail(email),
    id => getUserById(id)
)

async function getUserByEmail(email){
    try{
        return await User.findOne({ email: email })
    }catch(err){
        console.log(err)
        return null
    }
}

async function getUserById(id){
    try{
        return await User.findById(id)
    }catch(err){
        console.log(err)
        return null
    }
}

app.set('view engine', 'ejs')           //defining view engine
app.set('views', __dirname + '/views')  //defining views path
app.set('layout', 'layouts/layout')     //defining layouts path

app.use(expressLayouts)                 
app.use(methodOverride('_method'))                 
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }))
app.use(express.urlencoded({ extended: false }))

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET, //SESION_SECRET env variable
    resave: false,                      //!resave session variables if nothing changed
    saveUninitialized: false            //!save empty value on session if there is none
}))
app.use(passport.initialize())          //initialize passport
app.use(passport.session())             //persist variables across the user session

const mongoose = require('mongoose')                            
const user = require('./models/user')
mongoose.connect(                       //connect to mongoose
    process.env.DATABASE_URL,           //database url env variable
    { useNewUrlParser: true }           //check this on mongodb version
)
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected with Mongoose'))

function checkAuthenticated(req, res, next){
    console.log('entered auth in server 78')
    if(req.isAuthenticated()){
        console.log("user is authenticated "+req.body.name)
        return next();
    }
    res.redirect('/login')
}

app.use('/', authRouter)
app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/profiles', movieRouter)
app.use('/profiles', profileRouter)

const PORT = (process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));