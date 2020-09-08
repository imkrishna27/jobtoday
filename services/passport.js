const keys = require('../config/dev');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');
const mongoose = require('mongoose');

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
	done(null,user.id);				//referece to mongo '_id'
});

passport.deserializeUser((id,done) => {
	User.findById(id).then(user =>{				//search from mongo '_id'
		done(null,user);
	});
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
	  callbackURL: '/auth/google/callback',
	  proxy:true
  },
  async (accesToken, refresh, profile,done) => {
    // console.log('profile',profile);
    const existingUser = await User.findOne({ email:profile.emails[0].value })
      if(existingUser){
        return done(null,existingUser);
      }
        const user = await new User({ name:profile.displayName,
                                      email:profile.emails[0].value,
                                      avatar:profile.photos[0].value,
                                      password:null }).save();
        done(null,user);

    	}
  	)
);