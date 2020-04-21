/**************
 * DEPENDENCIES
 **************/
const express = require('express');


/*****************
 * CONFIGURATION
 ****************/
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');



/****************
 * ROUTES
 ****************/

    //ROOT
    app.get('/', function(req, res){
        res.render('landing');
    })

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