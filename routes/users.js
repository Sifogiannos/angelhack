var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var users = mongoose.model( 'users', users );
var events = mongoose.model( 'events', events );


router.get('/events/:event_id', function(req, res) {
  if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	var user = req.user;
	events.findOne({_id:event_id}).populate('participants').lean().exec(function(err, event){
		var userArray = [];
		var participantsArray = [];
		var participants = event.participants;
		
		//remove user from participants
	  participants = removeFromParticipants(user._id, participants);

	  //create user category array [0, 0, 0, 0]
	  userArray = userCategoryArray(user.categories);

	  //create participants category array [0, 0, 0, 0]
	  participantsArray = participantsCategoryArray(participants);

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

function userCategoryArray(userCategories){
	var returnArray = [];
	//create the zero or one array
	for(var i= 0 ; i < userCategories.length; i++){
		if(userCategories[i] == 'developer'){
			returnArray[0] = 1;
		}else if(userCategories[i] == 'designer'){
			returnArray[1] = 1;
		}else if(userCategories[i] == 'enterpreneur'){
			returnArray[2] = 1;
		}else{
			returnArray[3] = 1;
		}
  }
  return returnArray;
}

function participantsCategoryArray(participants){
	//create the zero or one array
	participantsReturnArray = [];
	for(var i= 0 ; i < participants.length; i++){
		var userCategories = participants[i].categories;
		participantsReturnArray.push(userCategoryArray());
  }
  return participantsReturnArray;
}

module.exports = router;