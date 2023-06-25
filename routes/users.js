const router = require('express').Router();
const { getUsers, getUsersbyId, createUser, editProfileUser, editAvatarUser, login, getUser } = require('../controllers/user');
const auth = require('../middlwares/auth');

router.post('/signin', login);

router.post('/signup', createUser);

router.use(auth);

router.get('/me', getUser);

router.get('/:id', getUsersbyId);

router.get('', getUsers);

router.patch('/me', editProfileUser);

router.patch('/me/avatar', editAvatarUser);

module.exports = router;
