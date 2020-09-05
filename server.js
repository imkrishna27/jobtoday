const express = require('express');
const connectDB = require('./config/db');
const keys = require('./config/dev');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');

const app = express();

connectDB();

// google Oauth
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, 
  (accessToken, refreshToken, profile, done) => {
    console.log('Google access Token: ',accessToken); 
    console.log('refresh token: ',refreshToken);
    console.log('profile: ', profile);      //comment or remove console.log; only for test
  })
);

// Route Hnadler for google Oauth

app.get(
  '/auth/google', 
  passport.authenticate('google',{
    scope: ['profile', 'email']
  })
);

app.get('/auth/google/callback', 
        passport.authenticate('google'));


//@init middleware
app.use(
  express.json({
    extended: false,
  })
);

// @define routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT);         //Dont need the console log

module.exports = connectDB;
