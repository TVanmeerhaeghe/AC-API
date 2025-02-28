const { Estimate, Task, Customer } = require('../models');

exports.createEstimate = async (req, res) => {
    try {
        let {
            creation_date,
            validity_date,
            total_ht,
            total_tva,
            object,
            status,
            admin_note,
            customer_id,
            discount_name,
            discount_value,
            final_note
        } = req.body;

        if (!creation_date) {
            creation_date = new Date();
        }

        if (!validity_date) {
            const baseDate = creation_date ? new Date(creation_date) : new Date();
            baseDate.setMonth(baseDate.getMonth() + 1);
            validity_date = baseDate;
        }

        const newEstimate = await Estimate.create({
            creation_date,
            validity_date,
            total_ht,
            total_tva,
            object,
            status,
            admin_note,
            customer_id,
            discount_name,
            discount_value,
            final_note
        });

        return res.status(201).json({
            message: 'Estimate created successfully.',
            estimate: newEstimate
        });
    } catch (error) {
        console.error('Error creating estimate:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllEstimates = async (req, res) => {
    try {
        const estimates = await Estimate.findAll();
        return res.json(estimates);
    } catch (error) {
        console.error('Error fetching estimates:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getEstimateById = async (req, res) => {
    try {
        const { id } = req.params;
        const estimate = await Estimate.findByPk(id, {
            include: [
                { model: Task, as: 'tasks' },
                { model: Customer, as: 'customer' }
            ]
        });
        if (!estimate) {
            return res.status(404).json({ message: 'Estimate not found.' });
        }
        return res.json(estimate);
    } catch (error) {
        console.error('Error fetching estimate:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.updateEstimate = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            creation_date,
            validity_date,
            total_ht,
            total_tva,
            object,
            status,
            admin_note,
            customer_id,
            discount_name,
            discount_value,
            final_note
        } = req.body;

        const estimate = await Estimate.findByPk(id);
        if (!estimate) {
            return res.status(404).json({ message: 'Estimate not found.' });
        }

        estimate.creation_date = creation_date || estimate.creation_date;
        estimate.validity_date = validity_date || estimate.validity_date;
        estimate.total_ht = total_ht || estimate.total_ht;
        estimate.total_tva = total_tva || estimate.total_tva;
        estimate.object = object || estimate.object;
        estimate.status = status || estimate.status;
        estimate.admin_note = admin_note || estimate.admin_note;
        estimate.customer_id = customer_id || estimate.customer_id;
        estimate.discount_name = (discount_name !== undefined) ? discount_name : estimate.discount_name;
        estimate.discount_value = (discount_value !== undefined) ? discount_value : estimate.discount_value;
        estimate.final_note = final_note || estimate.final_note;

        await estimate.save();

        return res.json({
            message: 'Estimate updated successfully.',
            estimate
        });
    } catch (error) {
        console.error('Error updating estimate:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteEstimate = async (req, res) => {
    try {
        const { id } = req.params;
        const estimate = await Estimate.findByPk(id);
        if (!estimate) {
            return res.status(404).json({ message: 'Estimate not found.' });
        }
        await estimate.destroy();
        return res.json({ message: 'Estimate deleted successfully.' });
    } catch (error) {
        console.error('Error deleting estimate:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
