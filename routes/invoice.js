const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, isAdmin, invoiceController.createInvoice);
router.get('/', verifyToken, isAdmin, invoiceController.getAllInvoices);
router.get('/search', verifyToken, isAdmin, invoiceController.searchInvoices);
router.get('/paid-revenue', invoiceController.getPaidRevenue);
router.get('/:id', verifyToken, isAdmin, invoiceController.getInvoiceById);
router.put('/:id', verifyToken, isAdmin, invoiceController.updateInvoice);
router.delete('/:id', verifyToken, isAdmin, invoiceController.deleteInvoice);

module.exports = router;
