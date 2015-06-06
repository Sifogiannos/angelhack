var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	return res.json({status:"ok", user:req.user});
});

router.put('/', function(req, res){
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	var user = req.user;
	var name = req.body.name;
	var surname = req.body.surname;
	var jobTitle = req.body.jobTitle;
	var category = req.body.category;

	var categories = ['developer', 'designer', 'business', 'investor'];

	if(category && categories.indexOf(category)== -1){
		return res.json({status:"error", message:"no correct category"});
	}

	user.name = name || user.name;
	user.surname = name || user.surname;
	user.fullname = user.name + " " + user.surname;
	user.category = category || user.category;
	
	user.save(function(err, user){
		return res.json({status:"ok", user:user});
	});
});

module.exports = router;
