const express = require('express');
const router = express.Router();
const contactCtrl = require('../controllers/contactController');

router.post('/', contactCtrl.createContact);
router.get('/', contactCtrl.getAllContacts);
router.get('/:id', contactCtrl.getContactById);
router.delete('/:id', contactCtrl.deleteContact);

module.exports = router;
