const express = require('express');
const router = express.Router();
const estimateController = require('../controllers/estimateController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, isAdmin, estimateController.createEstimate);
router.get('/', verifyToken, isAdmin, estimateController.getAllEstimates);
router.get('/search', verifyToken, isAdmin, estimateController.searchEstimates);
router.get('/:id', verifyToken, isAdmin, estimateController.getEstimateById);
router.put('/:id', verifyToken, isAdmin, estimateController.updateEstimate);
router.delete('/:id', verifyToken, isAdmin, estimateController.deleteEstimate);

module.exports = router;
