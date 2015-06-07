var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var events = mongoose.model( 'events', events );
var users = mongoose.model( 'users', users );

router.get('/events/:event_id', function(req, res) {
	var event_id = req.params.event_id;
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	events.findOne({_id:event_id},function(err, event){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		return res.json({status:"ok", event:event});
	});
});
router.get('/events/:event_id/users', function(req, res) {
	var event_id = req.params.event_id;
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	events.findOne({_id:event_id}).populate('participants').exec(function(err, event){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		//Aggregate to find similarities
		return res.json({status:"ok", participants:event.participants});
	});
});
router.get('/users/:user_id', function(req, res) {
	var user_id = req.params.user_id;
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	users.findOne({_id:user_id}).exec(function(err, user){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		//Aggregate to find similarities
		return res.json({status:"ok", user:user});
	});
});
module.exports = router;