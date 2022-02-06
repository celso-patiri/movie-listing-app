const mongoose = require('mongoose')
const Profile = require('./profile')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    }
    // profile: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: false,
    //     ref: 'Profile'
    // }
})

userSchema.pre('remove', function(next){    //remove all profiles when user is deleted
    Profile.find({ user: this.user }, (err, profiles) => {
        if(err) next(err)
        else if(profiles.length > 0 ){       //if there are profiles associated with this user
            profiles.forEach(profile => {
                Profile.findByIdAndDelete(profile.id, function(errProfDelete){
                    if(errProfDelete) console.log(errProfDelete)
                    else console.log('Delete profile: '+profile.id+' succesfully')
                })
            })    
        }
        next()
    })
})

module.exports = mongoose.model('User', userSchema)