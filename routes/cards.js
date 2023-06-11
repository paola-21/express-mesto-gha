const router = require('express').Router();
const { getCards, createCards, deleteCardbyId, likeCard, dislikeCard } = require('../controllers/card');

router.get('/cards', getCards);

router.post('/cards', createCards);

router.delete('/cards/:cardId', deleteCardbyId);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
