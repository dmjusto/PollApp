const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


//SCHEMA SETUP
const User = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);

