var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var events = mongoose.model( 'events', events );
var users = mongoose.model( 'users', users );

router.get('/events/:event_id', function(req, res) {
	var event_id = req.params.event_id;
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	events.findOne({_id:event_id},function(err, event){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		return res.json({status:"ok", event:event});
	});
});
router.get('/users', function(req, res) {
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	events.find({'participants':req.user._id}).lean().populate('participants').exec(function(err, events){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		var users = [];
		var obj = req.user.toObject();
		for (var i = 0; i < events.length; i++) {
			events[i].participants.forEach(function(participant){
				var x =req.user.id.toString();
				var y = participant._id.toString();
				if( x != y ){
					//TODO: parsing double users maybe
					users.push(participant);
				}
			});
		};
		//Get similarities by event matching AND category-skill matching
		var similarUsers = findSimilarUsers(req.user,users);
		similarUsers = similarUsers.sort(function(a,b){
			return b.similarity-a.similarity;
		})
		if(similarUsers.length>15){
			similarUsers.splice(15,similarUsers.length-16);
		}
		return res.json({status:"ok", users:users});
	});
});
router.get('/events/:event_id/users', function(req, res) {
	var event_id = req.params.event_id;
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	events.findOne({_id:event_id}).populate('participants').exec(function(err, event){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		var x =req.user.id.toString();
		
		for (var i = 0; i < event.participants.length; i++) {
			var y = event.participants[i]._id.toString();
			if(x==y){
				event.participants.splice(i,1);
			}
		};
		//Aggregate to find similarities
		return res.json({status:"ok", participants:event.participants});
	});
});
router.get('/users/:user_id', function(req, res) {
	var user_id = req.params.user_id;
	if(!req.user){
		return res.json({status:"error", message:"you are not logged in"});
	}
	users.findOne({_id:user_id}).exec(function(err, user){
		if(err){
			return res.json({status:"error", message:"Server error"});
		}
		return res.json({status:"ok", user:user});
	});
});
function findSimilarUsers(user,users){
	var myCatArray = userCategoryArray;
	var similarUsers = [];
	for (var i = 0; i < users.length; i++) {
		similarUsers.push({
			user:users[i],
			similarity:usersSimilarities(user,users[i])
		});
	};
	return similarUsers;
}
function userCategoryArray(userCategories){
	var returnArray = [0, 0, 0, 0];
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
		var userCatArray = userCategoryArray(userCategories);
		participantsReturnArray.push(userCatArray);
  }
  return participantsReturnArray;
}
function usersSimilarities(user, users){
	var interests = userCategoryArray(user.categories);
	var categories = userCategoryArray(users.categories);
	var myInterestCategories = 0, similarCategories = 0;
	for(var i= 0 ; i < interests.length; i++){
		if(interests[i]){
			myInterestCategories++;
			if(interests[i] == categories[i]){
				similarCategories++;
			}
		}
  }
  var categorySimilarity = (similarCategories/myInterestCategories);
  var skillSimilarityArray=[];
  var skillSimilarity = 0;
  var iterator = 0;
  var stop = false;
  for (var i = 0; i < user.skills.length; i++) {
  	var max_similarity = 0;
  	stop = false;
  	for (var k = 0; k < users.skills.length; k++) {
  		var distance = gd(user.skills[i],users.skills[k]);
  		if(distance==1){
  			skillSimilarityArray.push(1);
  			users.skills.splice(k,1);
  			max_similarity = false;
  			stop = true;
  		}
  		else if(distance>0 && distance<1){
  			max_similarity = distance;
  			iterator = k;
  		}
  		if(stop){
  			break;
  		}
  	};
  	if(max_similarity){
  		skillSimilarityArray.push(max_similarity);
  		users.skills.splice(iterator,1);
  	}
  };
  for (var i = 0; i < skillSimilarityArray.length; i++) {
  	skillSimilarity+=skillSimilarityArray[i];
  };
  skillSimilarity = skillSimilarity/skillSimilarityArray.length;
  return (categorySimilarity+skillSimilarity)/2;
}
// Compute the edit distance between the two given strings
function gd(a, b) {
  	if(a.length === 0) return b.length; 
  	if(b.length === 0) return a.length; 
 	
  var matrix = [];
 
  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }
 
  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }
 
  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }
  return (Math.max(a.length,b.length)- matrix[b.length][a.length])/Math.max(a.length,b.length);
};
module.exports = router;