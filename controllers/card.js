const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');// 404
const ErrNotAuth = require('../utils/NotErrAuth');// 400
const NotAccess = require('../utils/NotAccess');// 403

const getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    res.status(200).send(card);
  } catch (err) {
    if (err.message.includes('validation failed')) {
      return next(new ErrNotAuth('Вы ввели некоректные данные'));
    }
    next(err);
  }
};

const createCards = (req, res, next) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrNotAuth('Вы ввели некоректные данные'));
      }
      next(err);
    });
};

const deleteCardbyId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndRemove(card._id)
          .then(() => {
            res.status(200).send({ data: card });
          })
          .catch(next);
      }
      next(new NotAccess('Невозможно удалить карточку'));
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new ErrNotAuth('Вы ввели некоректные данные'));
      } else {
        next(e);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        return next(new ErrNotAuth('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        return next(new ErrNotAuth('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};

module.exports = {
  getCards, createCards, deleteCardbyId, likeCard, dislikeCard,
};
