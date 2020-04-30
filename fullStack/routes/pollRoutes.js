const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');
const middleware = require('../middleware');

//INDEX ROUTE
router.get('/polls', function(req, res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    Poll.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allPolls){
        Poll.count().exec(function(err, count){
            if(err){
                console.log(err);
            }
            else{
                res.render('poll/index', {
                    polls: allPolls,
                    current: pageNumber,
                    pages: Math.ceil(count/ perPage)
                });
            }
        });
    });
    // Poll.find({}, function(err, polls){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         res.render('poll/index', {polls: polls});
    //     }
    // })
})

//NEW
router.get('/polls/new', middleware.isLoggedIn, function(req, res){
    res.render('poll/new');
})

//CREATE
router.post('/polls', middleware.isLoggedIn, function(req, res){
    const title = req.sanitize(req.body.title);
    const choices = req.body.choice;
    var options = [];
    var votes = [];
    var totalVotes = 0;
    choices.forEach(choice => {
        if(choice !== ""){
            choice = req.sanitize(choice);
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
            var alreadyVoted;
            if(req.isAuthenticated()){
                alreadyVoted = getUserVoted(foundPoll, req);
            }         
            res.render('poll/show', {poll: foundPoll, alreadyVoted: alreadyVoted});
        }
    })
})

//VOTE ROUTE
router.post('/polls/:id/vote', middleware.isLoggedIn, function(req, res){
    Poll.findById(req.params.id, function(err, foundPoll){
        if(err){
            console.log(err);
        }
        else{
            //check if current user already voted
            if(getUserVoted(foundPoll, req)){
                req.flash('error', 'you already voted');
                return res.redirect('back');
            }
            //User hasn't voted yet so allow to vote
            else{
                foundPoll.voters.push(req.user._id);

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

function getUserVoted(foundPoll, req)
{
    return foundPoll.voters.some(function (voter)
    {
        return voter.equals(req.user._id);
    });
}
