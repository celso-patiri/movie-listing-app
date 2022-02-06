const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById){

    const authenticateUser = async  (email, password, done) => {
        let user =  await getUserByEmail(email)
        user = user.usr
        if(user == null){
            return done(null, false, { message: 'Email not registered' })
        } 
        try{
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }else{
                return done(null, false, { message: 'Wrong password' })
            }
        }catch (err){
            return done(err)
        }
    } 

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        let user = await getUserById(id)
        user = user.usr
        return done(null, user)
    })
}   

module.exports = initialize