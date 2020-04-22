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




module.exports = router;