const jwt = require('jsonwebtoken');
const TokenError = require('./TokenError');


const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    console.log(payload);
  } catch (e) {
    next(new TokenError('Необходима авторизация'));
    // const err = new Error('Необходима авторизация');
    // err.statusCode = 401;
    next(err);
  }
  req.user = payload;
  next();
};
module.exports = auth;