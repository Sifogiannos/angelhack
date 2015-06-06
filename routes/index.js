var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		res.render('first_steps', {
			user:req.user
		});
	}
	else{
		res.render('login')
	}
});
module.exports = router;
