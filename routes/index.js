const router = require('express').Router();
const userRouts = require('./users');
const cardRouts = require('./cards');

router.use('/users', userRouts);
router.use('/cards', cardRouts);

module.exports = router;
