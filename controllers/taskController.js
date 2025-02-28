const { Task } = require('../models');

exports.createTask = async (req, res) => {
    try {
        const {
            name,
            description,
            hours,
            tva,
            invoice_id,
            estimate_id,
            hourly_rate
        } = req.body;

        if (!invoice_id && !estimate_id) {
            return res.status(400).json({ message: 'Task must be associated with either an Invoice or an Estimate.' });
        }

        const newTask = await Task.create({
            name,
            description,
            hours,
            tva,
            invoice_id,
            estimate_id,
            hourly_rate
        });

        return res.status(201).json({
            message: 'Task created successfully.',
            task: newTask
        });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        return res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        return res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            hours,
            tva,
            invoice_id,
            estimate_id,
            hourly_rate
        } = req.body;
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        task.name = name || task.name;
        task.description = description || task.description;
        task.hours = hours || task.hours;
        task.tva = tva || task.tva;
        task.invoice_id = (invoice_id !== undefined) ? invoice_id : task.invoice_id;
        task.estimate_id = (estimate_id !== undefined) ? estimate_id : task.estimate_id;
        task.hourly_rate = (hourly_rate !== undefined) ? hourly_rate : task.hourly_rate;
        await task.save();
        return res.json({
            message: 'Task updated successfully.',
            task
        });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        await task.destroy();
        return res.json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
