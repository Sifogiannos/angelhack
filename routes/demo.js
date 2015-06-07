var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var events = mongoose.model( 'events', events );
var users = mongoose.model( 'users', users );
var messages = mongoose.model( 'messages', messages );
// Load and instantiate Chance
var chance = require('chance').Chance();

var jobTitles = ['CEO','CTO','CFO','CMO'];
var categories = ['developer','designer','enterpreneur','investor'];
var skills = [['nodejs','mongodb','javascript'],['business','funding','marketing','scrum'],['funding','investor','startups'],['illustrator','photoshop','design','dribbble']];
var event_id = '5573cb2aa0c0e9d09d5e7be5';
router.get('/database', function(req, res) {
	for (var i = 0; i < 100; i++) {
		var name = chance.first();
		var surname = chance.last();
		var fullname = name+" "+surname;
		var user = new users({
			name								: name,
			surname 						: surname,
			fullname 						: fullname, 
			company 						: chance.domain({tld: 'com'}) ,
			company_title 			: jobTitles[chance.integer({min: 0, max: jobTitles.length-1})],
			picture_Url					: '/img/default.png',
			categories 					: categories[chance.integer({min: 0, max: 3})],
			skills  						: skills[chance.integer({min: 0, max: skills.length-1})],
			interests 					: categories[chance.integer({min: 0, max: 3})], 					
			participated  			: [event_id],
			date_created 				: Date.now(),
			last_login 					: Date.now(),
			profileSteps  			: 2
		});
		user.save(function(err,user){
			events.findOneAndUpdate({_id:event_id},{$push:{participants:user._id}},function(err,event){
				console.log(err);
			});
		})
		res.end('Saving completed');
	};
});

module.exports = router;