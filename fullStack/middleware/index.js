const Poll = require('../models/poll');

const middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    req.flash('error', 'You must be logged in to do that');
    res.redirect('/login');
}

middlewareObj.checkPollOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Poll.findById(req.params.id, function(err, foundPoll){
            if(err || !foundPoll){
                req.flash('error', 'Poll not found');
            }
            else{
                if(foundPoll.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }
                else{
                    req.flash('error', "you don't have permission to do that");
                    res.redirect('back');
                }
            }
        })
    }
    else{
        req.flash('error', 'You must be logged in to do that');
        res.redirect('back');
    }
}


module.exports = middlewareObj;


