const router = require('express').Router();
const { getCards, createCards, deleteCardbyId, likeCard, dislikeCard } = require('../controllers/card');
const auth = require('../middlwares/auth');

router.use(auth);

router.get('', getCards);

router.post('', createCards);

router.delete('/:cardId', deleteCardbyId);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
