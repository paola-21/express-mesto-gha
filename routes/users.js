const router = require('express').Router();
const { getUsers, getUsersbyId, CreateUser, editProfileUser, editAvatarUser } = require('../controllers/user');

router.get('/users', getUsers);

router.get('/users/:id', getUsersbyId);

router.post('/users', CreateUser);

router.patch('/users/me', editProfileUser);

router.patch('/users/me/avatar', editAvatarUser);

module.exports = router;
