const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');

//INDEX ROUTE
router.get('/polls', function(req, res){
    res.render('poll/index');
})

//NEW
router.get('/polls/new', function(req, res){
    res.render('poll/new');
})

//CREATE
router.post('/polls', function(req, res){
    const title = req.body.title;
    const options = req.body.choices;
    // const creationDate = new Date().date
    const newPoll = {title: title, options: options};
    Poll.create(newPoll, function(err, newlyCreatedPoll){
        if(err){
            console.log(err);
            res.redirect('back');
        }
        else{
            console.log(newlyCreatedPoll);
            req.flash('success', 'New Poll ');
            res.redirect('/polls');
        }
    })
})


module.exports = router;