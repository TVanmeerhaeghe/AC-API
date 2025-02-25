const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, isAdmin, taskController.createTask);
router.get('/', verifyToken, isAdmin, taskController.getAllTasks);
router.get('/:id', verifyToken, isAdmin, taskController.getTaskById);
router.put('/:id', verifyToken, isAdmin, taskController.updateTask);
router.delete('/:id', verifyToken, isAdmin, taskController.deleteTask);

module.exports = router;
