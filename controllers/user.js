const bcrypt = require('bcryptjs');
const token = require('jsonwebtoken');
const MongooseError = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');// 404
const ErrNotAuth = require('../utils/NotErrAuth');// 400
const DuplicateEmail = require('../utils/DublicateEmail');// 409
const TokenError = require('../utils/TokenError');// 401

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
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } if (err.name === 'CastError') {
        return next(new ErrNotAuth('Переданы некорректные данные'));
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ErrNotAuth('Переданы некорректные данные'));
      }
      next(err);
    });
};

const editProfileUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ErrNotAuth('Переданы некорректные данные'));
      }
      next(err);
    });
};

const editAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ErrNotAuth('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getUsers, getUsersbyId, editProfileUser, editAvatarUser, getUser,
};
