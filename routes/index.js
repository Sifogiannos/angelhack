var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var users = mongoose.model( 'users', users );


router.get('/', function(req, res) {
	if(!req.user){
		return res.render('login');
	}
	users.findOne({_id:req.user.id}, function(err, user){
		if(!user.profileSteps || user.profileSteps < 2){
			return res.render('first_steps', {
				user : user
			});
		}
		return res.render('dashboard', {
			user : user
		});
	});
});

router.put('/', function(req, res){
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	var user = req.user;
	var name = req.body.name;
	var surname = req.body.surname;
	var jobTitle = req.body.jobTitle;
	var categories = req.body.categories;
	var company = req.body.company;
	var skills = req.body.skills;
	var interests = req.body.interests;
	var step = req.body.step;

	//lowerCase the skills
	if(skills){
		for(var i= 0 ; i < skills.length; i++){
	    skills[i] = skills[i].toLowerCase();
	  }
	}

	//lowerCase the interests
	if(interests){
		for(var i= 0 ; i < interests.length; i++){
	    interests[i] = interests[i].toLowerCase();
	  }
	}

	user.name = name || user.name;
	user.surname = surname || user.surname;
	user.fullname = user.name + " " + user.surname;
	user.company_title = jobTitle || user.company_title;
	user.categories = categories || user.categories;
	user.company = company || user.company;
	user.skills = skills ||user.skills;
	user.interests = interests ||user.interests;
	user.profileSteps = step || user.profileSteps;

	user.save(function(err, user){
		return res.json({status:"ok", user:user});
	});
});

module.exports = router;
