const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = (app) => {
    app.get('/auth/google', 
        passport.authenticate('google',{
            scope:['profile', 'email']
        })
    );

    app.get('/auth/google/callback',
    passport.authenticate('google'),
    (req,res) => {
      const payload = { user: {id: req.user.id }};
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    }
  );
};   
//testinf google oauth users
    // app.get('/api/current_user',(req, res) => {
        // res.send(res.user);
      // const payload = { user: {id: req.user.id }};
      // jwt.sign(
      //   payload,
      //   config.get('jwtToken'),
      //   { expiresIn: 360000 },
      //   (err, token) => {
      //     if (err) throw err;
      //     res.json({ token });
      //   }
      // );
    // });
//////////////////////////////
