const jwt = require('jsonwebtoken');
const TokenError = require('../utils/TokenError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    next(new TokenError('Необходима авторизация'));
    next(e);
  }
  req.user = payload;
  next();
};
module.exports = auth;
