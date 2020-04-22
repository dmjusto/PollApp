const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//ROOT ROUTE
router.get('/', function(req, res){
    res.render('landing');
})


/************************
 * AUTHENTICATION ROUTES
 ************************/

//LOGIN
router.get('/login', function(req, res){
    res.render('auth/login');
})

//LOGIN LOGIC
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/polls',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true
    }), function(req, res){

})


//SIGN UP
router.get('/register', function(req, res){
    res.render('auth/register');
})

//REGISTRATION LOGIC
router.post('/register', function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            console.log(err);
            return res.redirect('/register');
        }

        passport.authenticate('local')(req, res, function(){
            console.log('successful registration');
            req.flash('success', 'Welcom to PollApp ' + newUser.username);
            res.redirect('/polls');
        })
    })
})


//LOGOUT ROUTE
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged Out');
    res.redirect('/polls');
})



module.exports = router;