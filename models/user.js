var mongoose = require('mongoose')
var plm = require('passport-local-mongoose') // used to extend this model's functionality for passport

// create basic user schema
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    oauthID: String,
    oauthProvider: String,
    created: Date
})

// extend this model so it's no longer a regular model but used by passport for user management
userSchema.plugin(plm)

// export so it's public
module.exports = mongoose.model('User', userSchema)

