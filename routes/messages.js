var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var users = mongoose.model( 'users', users );
var messages = mongoose.model( 'messages', messages );
var notifications = mongoose.model( 'notifications', notifications );

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '122455',
  key: 'cd774e2b8a51f506bc9f',
  secret: 'c655051d34b700c1428d'
});

router.post('/users/:user_id', function(req, res){
	var user_id = req.params.user_id;
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	var user = req.user;
	var message = req.body.message || "Hi "+ user.name + ", would you like to meet?";

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
			pusher.trigger(user_id, 'new-notification', {'fullname': user.fullname, 'company_title': user.company_title, message: message.content});
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