var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var users = mongoose.model( 'users', users );
var events = mongoose.model( 'events', events );


router.get('/events/:event_id', function(req, res) {
	var event_id = req.params.event_id;
  if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	var user = req.user;
	var populate = {path:'participants', select:'-linkedin -interests'};
	events.findOne({_id:event_id}).populate(populate).exec(function(err, event){
		event.toObject();
		var userArray = [];
		var participantsArray = [];

		var participants = event.participants;

	  //create user category array [0, 0, 0, 0]
	  userArray = userCategoryArray(user.interests);

	  //create participants category array [0, 0, 0, 0]
	  participantsArray = participantsCategoryArray(participants);

	  //find interest semilarity rate
	  //for one user
	  console.log(interestSimilarity(userArray, participantsArray[0]));

		return res.json({status:"ok", allUsers:participants});
	});
});
router.get('/:user_id',function(req,res){
	return res.render('user');
})

function removeFromParticipants(user_id, participants){
	var iterator;
	//remove user from participants
	for(var i= 0 ; i < participants.length; i++){
		if(participants[i]._id.equals(user_id)){
			iterator = i;
			break;
		}
  }
  if(iterator){
  	participants = participants.splice(iterator, 1);
  }
  return participants;
}
module.exports = router;