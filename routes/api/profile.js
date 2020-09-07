const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile');
const User = require('../../models/users');

const { check, validationResult } = require('express-validator');

// @route POST api/profile
// @desc create or upadate profile
// @access Private

router.post(
  '/',
  [
    auth,
    check('status', 'Status Required*').not().isEmpty(),
    check('skills', 'Skills Required*').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //@ fetching data from html
    const {
      location,
      status,
      skills,
      bio,
      githubusername,
      linkedin,
    } = req.body;

    //@ building profile object

    const profileFields = {};

    //inserting userid
    profileFields.user = req.user.id;

    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (bio) profileFields.bio = bio;
    if (linkedin) profileFields.linkedin = linkedin;

    //splitting skills by comma and deleting extra space
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //updates the document and return updated json file
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route GET api/profile/me
// @desc get Profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar', 'email']);
    if (!profile) {
      return res.status(400).json({
        msg: 'There is no profile for this user',
      });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
