const User = require('../models/user');
const bcrypt = require('bcryptjs');
const token = require('jsonwebtoken');
const NotFoundError = require('../middlwares/NotFoundError');//404
const ErrNotAuth = require('../middlwares/NotErrAuth');
const MongooseError = require('mongoose');
const DuplicateEmail = require('../middlwares/DublicateEmail');//400
const TokenError = require('../middlwares/TokenError');//401

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    next(err);
  }
};

const getUsersbyId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'CastError') {
        return next(new DuplicateEmail('Вы ввели некоректные данные'));
      } else {
        next(err);
      }
    });
};

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
          } else if (err.name === 'ValidationError') {
            return next(new ErrNotAuth('Переданы некоректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
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
            next(new TokenError('Неправильные почта или пароль'));
          }
        });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true,
    runValidators: true})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ErrNotAuth('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const editProfileUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true,
    runValidators: true})
    .then((user) => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ErrNotAuth('Переданы некорректные данные'));
      } else {
       next(err);
      }
    });
};

const editAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true,
    runValidators: true})
    .then ((user) => res.status(200).send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ErrNotAuth('Переданы некорректные данные'));
      } else {
       next(err);
      }
    });
};

module.exports = { getUsers, getUsersbyId, createUser, editProfileUser, editAvatarUser, login, getUser };