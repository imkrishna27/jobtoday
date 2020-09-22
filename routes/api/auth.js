const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/users');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../config/dev');
// const passport = require('passport');
const { check, validationResult } = require('express-validator');
const { route } = require('./users');
const sgMail = require('@sendgrid/mail'); // run "npm install --save @sendgrid/mail"
sgMail.setApiKey(keys.mail_key);

// @route GET api/auth
// @desc TEST route
// @access Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/auth
// @desc login
// @access Public

router.post(
  '/',
  [
    check('email', 'Enter valid E-mail').isEmail(),
    check('password', 'Password Required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: ' Wrong Email' }] });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).json({ errors: [{ msg: 'Wrong Password!' }] });
      }

      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route POST api/auth/forgetpassword
// @desc reset password
// @access Public

router.put(
  '/forgetpassword',
  [
    check('email')
      .not()
      .isEmpty()
      .isEmail()
      .withMessage('Must be a valid Email!'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    try {
      const isemail = await User.findOne({ email });
      console.log(isemail);
      console.log(keys.jwt_reset_token);
      if (!isemail) {
        return res.status(400).json({ errors: [{ msg: 'Wrong Email' }] });
      } else {
        const emailToken = jwt.sign(
          {
            isemail: { id: isemail.id },
          },
          keys.jwt_reset_token,
          {
            expiresIn: '1m',
          }
        );

        const emailData = {
          from: keys.emailFrom,
          to: email,
          subject: 'Password Reset Link',
          html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${keys.client_url}/api/auth/reset/:${emailToken}</p>
                    <hr />
                    <P> this email contain sensetive info</p>
                    <p>${keys.client_url}</p>
                  `,
        };

        return isemail.updateOne(
          {
            resetPasswordLink: emailToken,
          },
          (err, success) => {
            if (err) {
              console.log('RESET PASSWORD LINK ERROR', err);
              return res.status(400).json({
                error: 'database connection error on user password forget',
              });
            } else {
              sgMail
                .send(emailData)
                .then((sent) => {
                  console.log('email sent', sent);
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction`,
                  });
                })
                .catch((err) => {
                  console.log('Email error', err);
                  return res.json({
                    message: err.message,
                  });
                });
            }
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// route.get('/reset/:emailToken',
//   [

//   ])

module.exports = router;
