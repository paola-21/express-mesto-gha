const router = require('express').Router();
const userRouts = require('./users');
const cardRouts = require('./cards');

router.use('/users', userRouts);
router.use('/cards', cardRouts);

router.use('/', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
