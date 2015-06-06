var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var users = mongoose.model( 'users', users );
var events = mongoose.model( 'events', events );


router.get('/', function(req, res){
	var mostPopular = req.body.mostPopular;
	var sort = "date_created";
	if(mostPopular){
		sort = "participants";
	}
	if(!req.user){
		return res.render('login');
	}
	events.find({}, '-participants').sort(sort).exec(function(err, allEvents){
		return res.json({status:"ok", events:allEvents});
	});
});

router.get('/:event_id', function(req, res) {
	var event_id = req.params.event_id;
	if(!req.user){
		return res.render('login');
	}
	events.findOne({_id:event_id}, '-participants', function(err, event){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		return res.json({status:"ok", event:event});
	});
});

module.exports = router;