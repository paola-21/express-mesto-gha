const router = require('express').Router();
const { getUsers, getUsersbyId, editProfileUser, editAvatarUser, getUser } = require('../controllers/user');
const { celebrate, Joi } = require('celebrate');
const pattern = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;

router.get('/me', getUser);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getUsersbyId);

router.get('', getUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editProfileUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(pattern),
  }),
}), editAvatarUser);

module.exports = router;
