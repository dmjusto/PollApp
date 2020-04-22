/**************
 * DEPENDENCIES
 **************/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const flash = require('connect-flash');

//ROUTE DEPENDENCIES
const indexRoutes = require('./routes/indexRoutes');
const pollRoutes = require('./routes/pollRoutes');

/*****************
 * CONFIGURATION
 ****************/
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
mongoose.connect('mongodb://localhost:27017/pollApp', {useNewUrlParser: true, useUnifiedTopology: true});


//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "This is the PollApp secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//PASS CURRENTUSER TO ALL ROUTES
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use(indexRoutes);
app.use(pollRoutes);


/***************
 * START SERVER
 **************/
app.listen(3000, function(){
    console.log('PollApp started on port 3000');
})