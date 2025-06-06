const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/signup', userController.signUp);
router.post('/signin', verifyToken, isAdmin, userController.signIn);
router.post('/forgot-password', userController.forgotPassword);

router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.get('/:id', verifyToken, isAdmin, userController.getUserById);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);
router.put(
  '/:id/password',
  verifyToken,
  isAdmin,
  userController.changePassword
);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
