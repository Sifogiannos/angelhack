var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var users = mongoose.model( 'users', users );
var messages = mongoose.model( 'messages', messages );
var notifications = mongoose.model( 'notifications', notifications );


router.post('/users/:user_id', function(req, res){
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	var user = req.user;
	var message = "Hi "+ user.name + ", would you like to meet?";

	var mewMessage = new messages({
		timeStamp : Date.now(),
		content 	: message,
		from 			: user._id,
		to 				: user_id
	});

	mewMessage.save(function(err, message){
		var newNotifications = new notifications({
			owner 				: user_id,
			html_content 	: message.content,
			timestamp  		: Date.now(),
			message  			: message._id
		});

		newNotifications.save(function(err, notification){
			res.json({status:"ok", message:message});
		});
	});

});

router.get('/', function(req, res){
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	res.render('inbox',{
		user:req.user
	});
});


module.exports = router;