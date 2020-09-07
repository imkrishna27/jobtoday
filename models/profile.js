const mongoose = require('mongoose');
const schema = mongoose.Schema;

const profileSchema = new schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      passingyear: {
        type: String,
        required: true,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('userprofiles', profileSchema);
