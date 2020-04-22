const express = require('express');
const router = express.Router();

//INDEX ROUTE
router.get('/polls', function(req, res){
    res.render('pollRoutes/index');
})


module.exports = router;