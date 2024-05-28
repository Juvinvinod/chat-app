const express = require('express');

const router = express.Router();
// controllers
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.get('/users', userController.getUsers);
router.get('/chat', userController.getChatDetails);

module.exports = router;
