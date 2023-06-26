const router = require('express').Router();
const { getUsers, getUsersbyId, editProfileUser, editAvatarUser, getUser } = require('../controllers/user');
const auth = require('../middlwares/auth');
const { celebrate, Joi } = require('celebrate');

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().required().length(24).hex(),
  }),
}), getUsersbyId);

router.use(auth);

router.get('/me', getUser);

router.get('', getUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editProfileUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/),
  }),
}), editAvatarUser);

module.exports = router;
