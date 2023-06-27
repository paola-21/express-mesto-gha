const Card = require('../models/card');

const NotFoundError = require('../middlwares/NotFoundError');//404
const ErrNotAuth = require('../middlwares/NotErrAuth');//400
const DuplicateEmail = require('../middlwares/DublicateEmail');//409
const TokenError = require('../middlwares/TokenError');//401

const getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    res.status(200).send(card);
  } catch (err) {
    if (err.message.includes('validation failed')) {
      return next(new ErrNotAuth('Вы ввели некоректные данные'));
    } else {
      next(err);
    }
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
      } else {
        next(err);
      }
    });
};

const deleteCardbyId = (req, res, next) => {
Card.findById(req.params.cardId)
  // .orFail(() => {
  //   throw new NotFoundError('Not found');
  // })
  .then((card) => {
    //const owner = card.owner._id;
    if (req.user._id === card.owner._id) {
      Card.deleteOne(card)
        .then(() => {
          res.send(card);
          })
        .catch(next);
    } else {
      return next(new TokenError('Вы ввели некоректные данные'));
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new ErrNotAuth('Вы ввели некоректные данные'));
    } else {
      next(err);
    }
  });
};

//   Card.findByIdAndRemove(req.params.cardId)
//     .orFail(() => new Error('Not found'))
//     .then((card) => res.status(200).send({ data: card }))
//     .catch((err) => {
//       if (err.message.includes('Cast to ObjectId failed for value')) {
//         return next(new ErrNotAuth('Вы ввели некоректные данные'));
//       } else if (err.message === 'Not found') {
//         return next(new NotFoundError('Карточка с указанным _id не найдена'));
//       } else {
//         next(err);
//       }
//     });
// };

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        return next(new ErrNotAuth('Передан несуществующий _id карточки'));
      } else if (err.message === 'Not found') {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        return next(new ErrNotAuth('Передан несуществующий _id карточки'));
      } else if (err.message === 'Not found') {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports = { getCards, createCards, deleteCardbyId, likeCard, dislikeCard };
