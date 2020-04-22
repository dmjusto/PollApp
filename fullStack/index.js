/**************
 * DEPENDENCIES
 **************/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');

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

app.use(indexRoutes);
app.use(pollRoutes);


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
// app.use(function(req, res, next){
//     res.locq.currentUser = req.user;
// })



/****************
 * ROUTES
 ****************/

    //ROOT
    // app.get('/', function(req, res){
    //     res.render('landing');
    // })

    //INDEX
    app.get('/polls', function(req, res){
        res.render('pollRoutes/index');
    })



/***************
 * START SERVER
 **************/
app.listen(3000, function(){
    console.log('PollApp started on port 3000');
})