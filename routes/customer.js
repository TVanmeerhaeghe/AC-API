const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, isAdmin, customerController.createCustomer);
router.get('/', verifyToken, isAdmin, customerController.getAllCustomers);
router.get('/search', verifyToken, isAdmin, customerController.searchCustomers);
router.get('/:id', verifyToken, isAdmin, customerController.getCustomerById);
router.put('/:id', verifyToken, isAdmin, customerController.updateCustomer);
router.delete('/:id', verifyToken, isAdmin, customerController.deleteCustomer);

module.exports = router;
