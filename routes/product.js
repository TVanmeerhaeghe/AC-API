const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

const cpUpload = uploadMiddleware.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 }
]);

router.get('/search', productController.searchProducts);

router.post('/', verifyToken, isAdmin, cpUpload, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/sold-revenue', verifyToken, isAdmin, productController.getSoldRevenue);
router.put('/:id', verifyToken, isAdmin, cpUpload, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);


module.exports = router;

