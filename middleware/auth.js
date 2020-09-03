const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  //if no token found

  if (!token) {
    return res.status(401).json({
      msg: 'no tokens found !',
    });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtToken'));
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({
      msg: 'In-valid Token',
    });
  }
};
