var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var users = mongoose.model( 'users', users );
var events = mongoose.model( 'events', events );


router.get('/events/:event_id', function(req, res) {
  if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	events.findOne({_id:event_id}).populate('participants').exec(function(err, event){
		return res.json({status:"ok", allUsers:event.participants});
	});
});

module.exports = router;