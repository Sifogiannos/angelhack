var mongoose = require( 'mongoose' );
var events = mongoose.model( 'events', events );

var crypto    = require('crypto');
var key       = 'secret';
var algorithm = 'sha1';
var hash, hmac;

var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

var mongoose = require( 'mongoose' );
var users = mongoose.model( 'users', users );

module.exports = function(passport, LocalStrategy){

  function findById(id, fn) {
    users.findOne({ _id : id},function(err,user){
    	if(err)
    		return fn(err);
    	if(user)
    		return fn(null,user);
    	return fn(new Error('User ' + id + ' does not exist'));
    });
  }

  function findByUsername(username, fn) {
    users.findOne({username : username.toLowerCase()},function(err,user){
      if(err) 
      	return fn(err);
      if(user)
        return fn(null,user);
      return fn(null,null);
    });
  }

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Local authentication
  passport.use(new LocalStrategy(
    function(username, password, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        hmac = crypto.createHmac(algorithm, key);

  		  // change to 'binary' if you want a binary digest
  		  hmac.setEncoding('hex');

  		  // write in the text that you want the hmac digest for
  		  hmac.write(password);

  		  // you can't read from the stream until you call end()
  		  hmac.end();

  		  // read out hmac digest
  		  hash = hmac.read();
        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        findByUsername(username, function(err, user) {
          if(err){
          	return done(err);
          }
          if(!user){ 
            console.log("no user");
            return done(null, false, { message: 'Username or Password were incorrect'});
          }
          if(user.password != hash){
            return done(null, false, { message: 'Username or Password were incorrect' });
          }
          return done(null, user);
        });
      });
    }
  ));
  
  //LinkedIn authentication
  passport.use(new LinkedInStrategy({
    clientID          : "77777mo8nw82c4",
    clientSecret      : "F4aPxOkLMLSbriRB",
    callbackURL       : "/auth/linkedin/callback",
    scope             : [ 'r_emailaddress', 'r_basicprofile' ],
    passReqToCallback : true
  },
  function(req, accessToken, refreshToken, profile, done){
    req.session.connect_error = undefined;
    //if is already logged in
    if(req.user){
      var user = req.user;
      user = setUserFromLinkedin(user, accessToken, profile);
      user.save(function(err, user){
        if(err){
          req.session.connect_error = "linkedin";
          return done(null, false, { message: 'Could not create user'});
        }else{
          return done(null, user);
        }
      });
    // if he is not logged in
    }else{
      users.findOne({'linkedin.uid': profile.id}).exec(function(err, user){
        if(err){
          req.session.connect_error = "linkedin";
          return done(null, false, { message: 'User not found'});
        }
        //if use exists
        if(user){
          return done(null, user);
        }
        //if user does not exists create an new one
        if(!user){
          user = new users({
            date_created  : Date.now()
          });
          user = setUserFromLinkedin(user, accessToken, profile);
          //save new user or update the already existing
          user.save(function(err, user){


            //insert 
            events.findOneAndUpdate({}, {$push:{participants:user._id}}, function(err, event){
              users.findOneAndUpdate({_id:user._id}, {$push:{participated:event._id}}, function(err){});
            });
            

            if(err){
              req.session.connect_error = "linkedin";
              return done(null, false, { message: 'Could not create user'});
            }else{
              return done(null, user);
            }
          });
        }
      });
    }
  }));
  
  //set properties of user
  function setUserFromLinkedin(person, token, profile){
    var x = JSON.parse(profile._raw);
    //find current company name and company title
    for(var i= 0 ; i < x.positions.values.length; i++){
      if(x.positions.values[i].isCurrent == true){
        person.company = x.positions.values[i].company.name;
        person.company_title = x.positions.values[i].title;
        break;
      }
    }

    person.linkedin={
      exists              : true,
      token               : token,
      headline            : profile._json.headline,
      industry            : profile._json.industry,
      uid                 : profile.id,
      location            : profile._json.location.name,
      numofConnections    : profile._json.numConnections,
    };
    person.name = profile.name.givenName;
    person.surname = profile.name.familyName;
    person.fullname = person.name + " " + person.surname;
    person.email = profile._json.emailAddress;
    person.picture_Url = profile._json.pictureUrl,
    person.public_Profile_Url = profile._json.publicProfileUrl,
    person.last_login = Date.now();
    person.summary = x.summary;
    return person;
  }
};