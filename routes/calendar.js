const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, isAdmin, calendarController.createCalendar);
router.get('/', verifyToken, isAdmin, calendarController.getAllCalendars);
router.get('/:id', verifyToken, isAdmin, calendarController.getCalendarById);
router.put('/:id', verifyToken, isAdmin, calendarController.updateCalendar);
router.delete('/:id', verifyToken, isAdmin, calendarController.deleteCalendar);

module.exports = router;
