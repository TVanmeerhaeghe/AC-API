const express = require('express');
const router = express.Router();
const contactCtrl = require('../controllers/contactController');

router.post('/contacts', contactCtrl.createContact);
router.get('/contacts', contactCtrl.getAllContacts);
router.get('/contacts/:id', contactCtrl.getContactById);
router.delete('/contacts/:id', contactCtrl.deleteContact);

module.exports = router;
