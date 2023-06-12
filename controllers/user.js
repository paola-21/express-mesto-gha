const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    if (err.message.includes('validation failed')) {
      res
      .status(400)
      .send({ message: 'Вы ввели некоректные данные' });
    } else {
      res
        .status(500)
        .send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
    }
  }
};

const getUsersbyId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        res
          .status(400)
          .send({
            message: 'Запрашиваемый пользователь не найден',
          });
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

const CreateUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Вы ввели некоректные данные' });
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

const editProfileUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const profile = await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    res.status(200).send(profile);
  } catch (err) {
    if (err.message.includes('validation failed')) {
      res
        .status(400)
        .send({ message: 'Вы ввели некоректные данные' });
    } else if (err.message.includes('Cast to ObjectId failed for value')) {
      res
        .status(404)
        .send({
          message: 'Запрашиваемый пользователь не найден',
          err: err.message,
          stack: err.stack,
        });
    } else {
      res
        .status(500)
        .send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
    }
  };
};
const editAvatarUser = async (req, res) => {
  try {
    const { avatar } = req.body;
    const profile = await User.findByIdAndUpdate(req.user._id, { avatar: avatar}, { new: true });
    res.status(200).send(profile);
  } catch (err) {
    if (err.message.includes('validation failed')) {
      res
      .status(400)
      .send({ message: 'Вы ввели некоректные данные' });
    } else if (err.message.includes('Cast to ObjectId failed for value')) {
      res
        .status(404)
        .send({
          message: 'Запрашиваемый пользователь не найден',
          err: err.message,
          stack: err.stack,
        });
    } else {
      res
        .status(500)
        .send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
    }
  };
};

module.exports = { getUsers, getUsersbyId, CreateUser, editProfileUser, editAvatarUser };