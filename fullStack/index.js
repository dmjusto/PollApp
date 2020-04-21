/**************
 * DEPENDENCIES
 **************/
const express = require('express');


/*****************
 * CONFIGURATION
 ****************/
const app = express();
app.set('view engine', 'ejs');



/****************
 * ROUTES
 ****************/
app.get('/', function(req, res){
    res.render('landing');
})



/***************
 * START SERVER
 **************/
app.listen(3000, function(){
    console.log('PollApp started on port 3000');
})