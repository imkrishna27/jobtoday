const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

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

app.listen(PORT, () => {
  console.log(`Project started at port ${PORT}`);
});

module.exports = connectDB;
