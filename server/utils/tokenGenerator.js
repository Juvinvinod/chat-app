require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const payload = { subject: id };
  const token = jwt.sign(payload, process.env.JWTSECRET);
  return token;
};

module.exports = generateToken;
