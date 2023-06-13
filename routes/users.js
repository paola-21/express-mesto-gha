const router = require('express').Router();
const { getUsers, getUsersbyId, CreateUser, editProfileUser, editAvatarUser } = require('../controllers/user');

router.get('', getUsers);

router.get('/:id', getUsersbyId);

router.post('', CreateUser);

router.patch('/me', editProfileUser);

router.patch('/me/avatar', editAvatarUser);

module.exports = router;
