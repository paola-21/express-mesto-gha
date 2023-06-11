const router = require('express').Router();
const userRouts = require('./users');
const cardRouts = require('./cards');

router.use(userRouts);
router.use(cardRouts);

module.exports = router;
