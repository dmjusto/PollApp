const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');
const middleware = require('../middleware');

//INDEX ROUTE
router.get('/polls', function(req, res){
    Poll.find({}, function(err, polls){
        if(err){
            console.log(err);
        }
        else{
            res.render('poll/index', {polls: polls});
        }
    })
})

//NEW
router.get('/polls/new', middleware.isLoggedIn, function(req, res){
    res.render('poll/new');
})

//CREATE
router.post('/polls', middleware.isLoggedIn, function(req, res){
    const title = req.body.title;
    const options = req.body.choice;
    const author = {
        username: req.user.username,
        id: req.user._id
    };
    const newPoll = {title: title, options: options, author: author};
    
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

//SHOW ROUTE
router.get('/polls/:id', function(req, res){
    Poll.findById(req.params.id, function(err, foundPoll){
        if(err || !foundPoll){
            req.flash('error', 'Poll not found');
            res.redirect('back');
        }
        else{
            res.render('poll/show', {poll: foundPoll});
        }
    })
})

//UPDATE ROUTE
router.put('/polls/:id', function(req, res){
    Poll.findById(req.params.id, function(err, foundPoll){
        if(err){
            console.log(err);
        }
        else{
            req.flash('success', 'vote index: ' +  req.body.vote)
            res.redirect('back')
        }
    })
    
    
})

//DESTROY ROUTE
router.delete('/polls/:id/delete', middleware.checkPollOwnership, function(req, res){
    Poll.findByIdAndRemove(req.params.id, function(err, removedPoll){
        if(err){
            req.flash('error', err);
            res.redirect('/back');
        }
        else{
            req.flash('success', 'Poll deleted');
            res.redirect('/polls');
        }
    })
})


module.exports = router;