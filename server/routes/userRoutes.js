const express = require('express');

const router = express.Router();
// controllers
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/tokenChecker');

router.post('/login', userController.login);
router.get('/users', verifyToken, userController.getUsers);
router.get('/chat', verifyToken, userController.getChatDetails);

module.exports = router;
