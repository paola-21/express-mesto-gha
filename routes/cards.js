const router = require('express').Router();
const { getCards, createCards, deleteCardbyId, likeCard, dislikeCard } = require('../controllers/card');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlwares/auth');

router.use(auth);

router.get('', getCards);

router.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/),
  }),
}), createCards);

router.delete('/:cardId', deleteCardbyId);

router.put('/:cardId/likes', likeCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
