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
router.get('/:id/invoices', verifyToken, isAdmin, customerController.getCustomerInvoices);
router.get('/:id/estimates', verifyToken, isAdmin, customerController.getCustomerEstimates);
router.get('/:id/products', verifyToken, isAdmin, customerController.getCustomerPurchasedProducts);

module.exports = router;
