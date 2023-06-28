const bcrypt = require('bcryptjs');
const token = require('jsonwebtoken');
const MongooseError = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');// 404
const ErrNotAuth = require('../utils/NotErrAuth');
const DuplicateEmail = require('../utils/DublicateEmail');// 400
const TokenError = require('../utils/TokenError');// 401

const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
    .then((hashedPassword) => {
      User.create({ ...req.body, password: hashedPassword })
        .then((user) => {
          res
            .status(201)
            .send({ data: user.deletePassword() });
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new DuplicateEmail('Пользователь с такой почтой уже существует'));
          } if (err.name === 'ValidationError' || err.name === 'ValidatorError') {
            return next(new ErrNotAuth('Переданы некоректные данные'));
          }
          next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(() => new TokenError('Пользователь не зарегистрирован'))
    .select('+password')
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = token.sign({ _id: user._id }, 'some-secret-key');
            res.cookie('jwt', jwt, {
              maxAge: 360000,
              httpOnly: true,
            });
            res.send({ data: user.deletePassword() });
          } else {
            return next(new TokenError('Неправильные почта или пароль'));
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { createUser, login };
