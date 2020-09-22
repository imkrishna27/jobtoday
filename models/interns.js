const mongoose = require('mongoose');
const schema = mongoose.Schema;

const internSchema = new schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sizeofcompany: {
    type: String,
    required: true,
  },
  jobprofile: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  stipend: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  postedon: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('interns', internSchema);
