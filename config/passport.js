// login validation for user using "passport" based on a local strategy


const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../models");

module.exports = function(passport) {
	// Attempt to authenticate from an email address
	passport.use(new LocalStrategy({usernameField: "email"}, (email, password, done) => {
		// Search email address in database
		db.User.findOne({ where: { email: email }})
			.then(user => {
				if (!user) {
					return done(null, false, { message: "There is no user found for " + email});
				}
        
				// Verify the input password matches with the one from database
				bcrypt.compare(password, user.password, (error, isMatch) => {
					if (error) throw error;
          
					if (isMatch) {
						return done(null, user);
					} else {
						return done(null, false, { message: "Wrong password!"});
					}
				});
			});
	}));
  
    // serializeUser determines which data of the user object should be stored in the session
    
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
  
    // Why do we need to use deserialize? the functions tell Passport.js how to get information from a user object to store in a session (serialize), and how to take that information and turn it back into a user object (deserialize)
    
	passport.deserializeUser(function(id, done) {
		db.User.findByPk(id)
			.then(user => {
				console.log(`User ${user.name} [ID: ${user.id}] logged in`);
				done(null, user);
			})
			.catch(err => { console.log(err);});
	});
};