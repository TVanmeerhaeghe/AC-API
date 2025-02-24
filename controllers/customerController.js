const { Customer } = require('../models');
const { Op } = require('sequelize');

/**
 * CREATE - Créer un nouveau client
 */
exports.createCustomer = async (req, res) => {
    try {
        const {
            name,
            surname,
            adress,
            city,
            postal_code,
            company,
            phone,
            email
        } = req.body;

        const newCustomer = await Customer.create({
            name,
            surname,
            adress,
            city,
            postal_code,
            company,
            phone,
            email
        });

        return res.status(201).json({
            message: 'Customer créé avec succès.',
            customer: newCustomer
        });
    } catch (error) {
        console.error('Erreur createCustomer :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * READ - Récupérer tous les clients
 */
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        return res.json(customers);
    } catch (error) {
        console.error('Erreur getAllCustomers :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * READ - Récupérer un client par ID
 */
exports.getCustomerById = async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer introuvable.' });
        }

        return res.json(customer);
    } catch (error) {
        console.error('Erreur getCustomerById :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * UPDATE - Mettre à jour un client
 */
exports.updateCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            name,
            surname,
            adress,
            city,
            postal_code,
            company,
            phone,
            email
        } = req.body;

        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer introuvable.' });
        }

        if (name !== undefined) customer.name = name;
        if (surname !== undefined) customer.surname = surname;
        if (adress !== undefined) customer.adress = adress;
        if (city !== undefined) customer.city = city;
        if (postal_code !== undefined) customer.postal_code = postal_code;
        if (company !== undefined) customer.company = company;
        if (phone !== undefined) customer.phone = phone;
        if (email !== undefined) customer.email = email;

        await customer.save();

        return res.json({ message: 'Customer mis à jour.', customer });
    } catch (error) {
        console.error('Erreur updateCustomer :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * DELETE - Supprimer un client
 */
exports.deleteCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer introuvable.' });
        }

        await customer.destroy();
        return res.json({ message: 'Customer supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur deleteCustomer :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * SEARCH - Rechercher des clients par un terme
 * Exemple : /search?q=John
 */
exports.searchCustomers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Paramètre "q" requis.' });
        }

        const customers = await Customer.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${q}%` } },
                    { surname: { [Op.like]: `%${q}%` } },
                    { email: { [Op.like]: `%${q}%` } }
                ]
            }
        });

        return res.json(customers);
    } catch (error) {
        console.error('Erreur searchCustomers :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
