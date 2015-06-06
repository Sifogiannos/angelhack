// Mongoose import
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var users = new Schema({
	username 						: String,
	password						: String,
	name								: String,
	surname 						: String,
	fullname 						: String, 
	email								: String,
	company 						: String,
	picture_Url					: String,
	public_Profile_Url 	: String,
	category 						: String, 					
	linkedin        		: {
    exists              : { type: Boolean, default: false },
    token               : String,
    headline            : String,
    industry            : String,
    uid                 : String,
    location            : String,
    numofConnections    : Number,
  },
  date_created 				: Date,
  last_login 					: Date
});


mongoose.model( 'users', users );

mongoose.connect( 'mongodb://localhost/test' );