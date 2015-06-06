var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var events = mongoose.model( 'events', events );
var users = mongoose.model( 'users', users );


router.get('/', function(req, res){
	var mostPopular = req.body.mostPopular;
	var sort = "begin_date";
	if(mostPopular){
		sort = "participants";
	}
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	events.find({}, '-participants').sort(sort).exec(function(err, allEvents){
		return res.json({status:"ok", events:allEvents});
	});
});

router.get('/:event_id', function(req, res) {
	var event_id = req.params.event_id;
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	events.findOne({_id:event_id}, '-participants', function(err, event){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		return res.json({status:"ok", event:event});
	});
});

router.get('/:event_id/search', function(req, res){
	var event_id = req.params.event_id;
	var search = req.body.search;
	if(!search){
		search = "";
	}

	var query = {'$or':[{fullname : new RegExp(search, "i")}, {company_title : new RegExp(search, "i")}, {company : new RegExp(search, "i")}]};

	var populate = {path:'participants', match:query, select:'-linkedin -interests', options:{sort:{'fullname':-1}}};
	
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}

	events.findOne({_id:event_id}).populate(populate).exec(function(err, event){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		return res.json({status:"ok", event:event});
	});
});

module.exports = router;