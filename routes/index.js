const router = require('express').Router();
const userRouts = require('./users');
const cardRouts = require('./cards');
const loginRouts = require('./login');
const auth = require('../middlwares/auth');
const NotFoundError = require('../utils/NotFoundError');

router.use('', loginRouts);

router.use(auth);

router.use('/users', userRouts);

router.use('/cards', cardRouts);

router.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
