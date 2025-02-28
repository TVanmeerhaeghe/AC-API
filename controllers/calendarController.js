const { Calendar } = require('../models');

exports.createCalendar = async (req, res) => {
    try {
        const {
            name,
            description,
            localisation,
            duration_time,
            start_date,
            end_date,
            customer_id
        } = req.body;

        const newCalendar = await Calendar.create({
            name,
            description,
            localisation,
            duration_time,
            start_date,
            end_date,
            customer_id
        });

        return res.status(201).json({
            message: 'Calendar created successfully.',
            calendar: newCalendar
        });
    } catch (error) {
        console.error('Error createCalendar:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllCalendars = async (req, res) => {
    try {
        const calendars = await Calendar.findAll();
        return res.json(calendars);
    } catch (error) {
        console.error('Error getAllCalendars:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getCalendarById = async (req, res) => {
    try {
        const { id } = req.params;
        const calendar = await Calendar.findByPk(id);

        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found.' });
        }

        return res.json(calendar);
    } catch (error) {
        console.error('Error getCalendarById:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.updateCalendar = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            localisation,
            duration_time,
            start_date,
            end_date,
            customer_id
        } = req.body;

        const calendar = await Calendar.findByPk(id);
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found.' });
        }

        if (name !== undefined) calendar.name = name;
        if (description !== undefined) calendar.description = description;
        if (localisation !== undefined) calendar.localisation = localisation;
        if (duration_time !== undefined) calendar.duration_time = duration_time;
        if (start_date !== undefined) calendar.start_date = start_date;
        if (end_date !== undefined) calendar.end_date = end_date;
        if (customer_id !== undefined) calendar.customer_id = customer_id;

        await calendar.save();

        return res.json({
            message: 'Calendar updated successfully.',
            calendar
        });
    } catch (error) {
        console.error('Error updateCalendar:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteCalendar = async (req, res) => {
    try {
        const { id } = req.params;
        const calendar = await Calendar.findByPk(id);

        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found.' });
        }

        await calendar.destroy();
        return res.json({ message: 'Calendar deleted successfully.' });
    } catch (error) {
        console.error('Error deleteCalendar:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
