//require database file
require('./db.js');
var mongoose = require('mongoose');

//authentication requirements
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;


var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//passport file
require('./pass.js')(passport, LocalStrategy);

var authentication = require('./routes/authentication.js');

var routes = require('./routes/index');
var user = require('./routes/users');
var events = require('./routes/events');
var api = require('./routes/api');
var messages = require('./routes/messages');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: "angelhack",
  store: new MongoStore({
    db: 'sessionstore',
    mongooseConnection: mongoose.connections[0]
  })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', user);
app.use('/events', events);
app.use('/messages', messages);
app.use('/api', api);

//Local authentication
app.get('/login', authentication.login);
app.get('/signup', authentication.signup);
app.post('/create_user', authentication.createUser);
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res){
    res.redirect('/');
  }
);
//LinkedIn authentication
app.get('/auth/linkedin', passport.authenticate('linkedin', {state:'angelhack'}), function(req, res){});
app.get('/auth/linkedin/callback', 
  passport.authenticate('linkedin', {failureRedirect: '/login', failureFlash: true }), 
  function(req, res) {
    if(req.session.connect_error){
      return res.json({status:"error", message:"connection error "+ req.session.connect_error});
    }else{
      return res.redirect('/');
    }
  }
);

app.get('/logout', authentication.logout);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
