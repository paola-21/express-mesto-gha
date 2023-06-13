const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const card = await Card.find({});
    res.status(200).send(card);
  } catch (err) {
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
  }
};

const createCards = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
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

const deleteCardbyId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
          });
      } else if (err.message === 'Not found') {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        res
          .status(400)
          .send({
            message: 'Передан несуществующий _id карточки',
          });
      } else if (err.message === 'Not found') {
        res
          .status(404)
          .send({ message: 'Переданы некорректные данные для постановки лайка.' });
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        res
          .status(400)
          .send({
            message: 'Передан несуществующий _id карточки',
          });
      } else if (err.message === 'Not found') {
        res
          .status(404)
          .send({ message: 'Переданы некорректные данные для постановки лайка.' });
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

module.exports = { getCards, createCards, deleteCardbyId, likeCard, dislikeCard };
