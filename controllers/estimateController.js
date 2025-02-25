const { Estimate } = require('../models');

/**
 * CREATE - Créer une nouvelle estimation
 */
exports.createEstimate = async (req, res) => {
    try {
        const {
            creation_date,
            validity_date,
            total_ht,
            total_tva,
            object,
            status,
            admin_note,
            customer_id,
            discount,
            final_note
        } = req.body;

        const newEstimate = await Estimate.create({
            creation_date,
            validity_date,
            total_ht,
            total_tva,
            object,
            status,
            admin_note,
            customer_id,
            discount,
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

/**
 * READ - Récupérer toutes les estimations
 */
exports.getAllEstimates = async (req, res) => {
    try {
        const estimates = await Estimate.findAll();
        return res.json(estimates);
    } catch (error) {
        console.error('Error fetching estimates:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * READ - Récupérer une estimation par ID
 */
exports.getEstimateById = async (req, res) => {
    try {
        const { id } = req.params;
        const estimate = await Estimate.findByPk(id);
        if (!estimate) {
            return res.status(404).json({ message: 'Estimate not found.' });
        }
        return res.json(estimate);
    } catch (error) {
        console.error('Error fetching estimate:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * UPDATE - Mettre à jour une estimation
 */
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
            discount,
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
        estimate.discount = discount || estimate.discount;
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

/**
 * DELETE - Supprimer une estimation
 */
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
