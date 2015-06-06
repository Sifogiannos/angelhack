// Mongoose import
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var users = new Schema({
	name						: String,
	surname 				: String, 
	email						: String,
	password				: String,
	company 				: String,
	img 						: String
	
});


mongoose.model( 'users', users );

mongoose.connect( 'mongodb://localhost/test' );