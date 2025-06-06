const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin, verifyResetToken } = require('../middleware/auth');

router.post('/signup', verifyToken, isAdmin, userController.signUp);
router.post('/signin', userController.signIn);
router.post('/forgot-password', userController.forgotPassword);

router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.put('/reset-password', verifyResetToken, userController.changePassword);
router.get('/:id', verifyToken, isAdmin, userController.getUserById);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
