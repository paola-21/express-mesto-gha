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

module.exports = { getUsers, getUsersbyId, editProfileUser, editAvatarUser, getUser };