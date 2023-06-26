const router = require('express').Router();
const { getUsers, getUsersbyId, editProfileUser, editAvatarUser, getUser } = require('../controllers/user');
const auth = require('../middlwares/auth');

router.get('/:id', getUsersbyId);

router.use(auth);

router.get('/me', getUser);

router.get('', getUsers);

router.patch('/me', editProfileUser);

router.patch('/me/avatar', editAvatarUser);

module.exports = router;
