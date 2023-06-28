const Card = require('../models/card');

const NotFoundError = require('../middlwares/NotFoundError');//404
const ErrNotAuth = require('../middlwares/NotErrAuth');//400
const DuplicateEmail = require('../middlwares/DublicateEmail');//409
const TokenError = require('../middlwares/TokenError');//401
const NotAccess = require('../middlwares/NotAccess');//403

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

// const deleteCardbyId = (req, res) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .orFail(() => new Error('Not found'))
//     .then((card) => res.status(200).send({ data: card }))
//     .catch((err) => {
//       if (err.message.includes('Cast to ObjectId failed for value')) {
//         res
//           .status(400)
//           .send({
//             message: 'Переданы некорректные данные для постановки лайка.',
//           });
//       } else if (err.message === 'Not found') {
//         res
//           .status(404)
//           .send({ message: 'Карточка с указанным _id не найдена.' });
//       } else {
//         res
//           .status(500)
//           .send({
//             message: 'Internal Server Error',
//             err: err.message,
//             stack: err.stack,
//           });
//       }
//     });
// };

const deleteCardbyId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotAccess('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      // const owner = card.owner.toString();
      // console.log(owner);
      if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndRemove(card._id)
          .then((card) => {
            res.status(200).send({ data: card });
          })
          .catch(next);
      } else {
        next(new NotAccess('Невозможно удалить карточку'));//403
      }
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
