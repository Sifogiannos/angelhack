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
	company_title 			: String,
	picture_Url					: String,
	public_Profile_Url 	: String,
	categories 					: [String],
	skills  						: [String],
	interests 					: [String], 					
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

var events = new Schema({
	title 				: String,
	begin_date 		: Date,
	end_date 			: Date,
	participants 	: [{ type: Schema.Types.ObjectId, ref: 'users' }],
	cover 				: String
});

var messages = new Schema({
	to 				: { type: Schema.Types.ObjectId, ref: 'users' },
	from 			: { type: Schema.Types.ObjectId, ref: 'users' },
	timestamp : Date,
	content		: String
});

var notifications = new Schema({
	owner 				: { type: Schema.Types.ObjectId, ref: 'users' },
	html_content 	: String,
	timestamp  		: Date,
	message  			: { type: Schema.Types.ObjectId, ref: 'messages' }
});


mongoose.model( 'users', users );
mongoose.model( 'events', events );
mongoose.model( 'messages', messages );
mongoose.model( 'notifications', notifications );

mongoose.connect( 'mongodb://localhost/test' );