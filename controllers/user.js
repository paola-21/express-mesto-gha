const User = require('../models/user');
const bcrypt = require('bcryptjs');
const token = require('jsonwebtoken');
const NotFoundError = require('../middlwares/NotFoundError');
const ErrNotAuth = require('../middlwares/NotErrAuth');
const MongooseError = require('mongoose');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res
      .status(500)
      .send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
  }
};

const getUsersbyId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Вы ввели некоректные данные' });
      } else {
        res
          .status(500)
          .send({ message: 'Internal Server Error' });
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
            return next(new NotFoundError('Пользователь с такой почтой уже существует'));
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
    .orFail(() => new NotFoundError('Пользователь не найден'))
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
            next(new ErrNotAuth('Не правильные почта или пароль'));
          }
        });
    })
    .catch(next);
};

const getUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true,
    runValidators: true})
    .then((user) => res.send({ data: user }))
        .catch ((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные'});
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const editProfileUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true,
    runValidators: true})
    .then ((user) => res.send({data: user}))
    .catch ((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные'});
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const editAvatarUser = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true,
    runValidators: true})
    .then ((user) => res.status(200).send({data: user}))
    .catch ((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные'});
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

module.exports = { getUsers, getUsersbyId, createUser, editProfileUser, editAvatarUser, login, getUser };