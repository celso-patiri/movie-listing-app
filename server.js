if(process.env.NODE_ENV !== 'production'){  //NODE_ENV loaded automatically by Node 
    require('dotenv').config()              //load env variables into process.env
}

const express = require('express')
const app = express()

const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./controllers/index')  //referecing routes on server
const userRouter = require('./controllers/users')  //referecing routes on server
const movieRouter = require('./controllers/movies')  //referecing routes on server
const profileRouter = require('./controllers/profiles')  //referecing routes on server

app.set('view engine', 'ejs')           //defining view engine
app.set('views', __dirname + '/views')  //defining views path
app.set('layout', 'layouts/layout')     //defining layouts path

app.use(expressLayouts)                 
app.use(methodOverride('__method'))                 
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }))


const mongoose = require('mongoose')                            
mongoose.connect(                       //connect to mongoose
    process.env.DATABASE_URL,           //database url env variable
    { useNewUrlParser: true }           //check this on mongodb version
)
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/movies', movieRouter)
app.use('/profiles', profileRouter)

app.listen(process.env.PORT || 3000)