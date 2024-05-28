require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    return res.status(401).json({
      status: 'failed',
      message: 'token not provided',
      data: '',
    });
  }
  const token = bearerHeader.split(' ')[1];
  if (token === null) {
    return res.status(401).json({
      status: 'failed',
      message: 'token not provided',
      data: '',
    });
  }

  try {
    jwt.verify(token, process.env.JWTSECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          status: 'failed',
          message: 'Authentication failed',
          data: '',
        });
      }
      req.userId = user.subject;
      next();
    });
  } catch (err) {
    return res.status(401).send('Unauthorized request');
  }
};

module.exports = verifyToken;
