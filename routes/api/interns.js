const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const internModel = require('../../models/interns');
const User = require('../../models/users');

const { check, validationResult } = require('express-validator');

// @route POST api/intern
// @desc add Intern
// @access Private

router.post(
  '/',
  [
    auth,
    check('company', 'Company Name is Required').not().isEmpty(),
    check('description', ' comapany description is Required').not().isEmpty(),
    check('sizeofcompany', 'Employee Numbers are Required').not().isEmpty(),
    check('jobprofile', 'Job profile is Required').not().isEmpty(),
    check('stipend', 'Stipend is Required').not().isEmpty(),
    check('skills', 'Skills are Required').not().isEmpty(),
    check('website', 'Website is Required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //@fetching data from html form
    const {
      company,
      description,
      sizeofcompany,
      jobprofile,
      stipend,
      skills,
      website,
      location,
    } = req.body;

    const internfields = {
      company,
      description,
      sizeofcompany,
      jobprofile,
      stipend,
      website,
      location,
    };

    internfields.user = req.user.id;
    internfields.skills = skills.split(',').map((skill) => skill.trim());

    //@insert into database
    try {
      const interns = new internModel(internfields);
      await interns.save();
      res.json(interns);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route GET api/intern
// @desc get all interns
// @access Public

router.get('', auth, async (req, res) => {
  try {
    const interns = await internModel.find().populate('user', ['name']);
    if (!interns) {
      return res.status(400).json({
        msg: 'No Interns',
      });
    }
    res.json(interns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/intern/:intern_id
// @desc Delete a intern
// @access Private

router.delete('/:intern_id', auth, async (req, res) => {
  try {
    const intern = await internModel.findOneAndRemove({
      _id: req.params.intern_id,
    });
    if (!intern) {
      return res.json('Intern dont exist');
    }
    res.json('Intern removed');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
