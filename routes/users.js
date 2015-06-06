var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var users = mongoose.model( 'users', users );


router.get('/', function(req, res) {
  if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	users.find({}, function(err, allUsers){
		return res.json({status:"ok", allUsers:allUsers});
	});
});

module.exports = router;
