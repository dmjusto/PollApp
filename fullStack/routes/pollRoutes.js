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
    // const options = req.body.choice;
    const choices = req.body.choice;
    var options = [];
    var votes = [];
    var totalVotes = 0;
    choices.forEach(choice => {
        if(choice !== ""){
            options.push(choice);
            votes.push(0);
        }
    });
    const author = {
        username: req.user.username,
        id: req.user._id
    };
    const newPoll = {title: title, options: options, votes: votes, totalVotes: totalVotes, author: author};
    
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
router.put('/polls/:id',  function(req, res){
    Poll.findById(req.params.id, function(err, foundPoll){
        if(err){
            console.log(err);
        }
        else{
            //check if current user already voted
            var userVoted = foundPoll.voters.some(function(voter){
                console.log('this user' + req.user_id)
                console.log('previous voters: ' + foundPoll.voters)
                return voter.equals(req.user._id);
            })
            console.log('user voted: ' + userVoted)
            //User already voted, so kick them out
            if(userVoted){
                console.log('already voted')
                req.flash('error', 'you already voted');
                return res.redirect('back');
            }
            //User hasn't voted yet so add them to list of voters
            else{
                foundPoll.voters.push(req.user._id);
            }
            /////////////////////////////////////


            const index = parseInt(req.body.vote);

            var voteCount = foundPoll.votes[index];
            voteCount++;
            foundPoll.votes.set(index, voteCount);

            var totalVotes = foundPoll.votes.reduce(function(a, b){
                return a + b;
            }, 0);

            foundPoll.totalVotes = totalVotes;

            foundPoll.save(function(err){
                if(err){
                    console.log(err);
                    req.flash('error', err);
                    res.redirect('back');
                }
                else{
                    return res.redirect('/polls/' + foundPoll._id);
                }
            })
            
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