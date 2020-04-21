/**************
 * DEPENDENCIES
 **************/
const express = require('express');

/*****************
 * CONFIGURATION
 ****************/
const app = express();

/***************
 * START SERVER
 **************/
app.listen(3000, function(){
    console.log('PollApp started on port 3000');
})