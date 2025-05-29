const { Contact } = require('../models');

exports.createContact = async (req, res) => {
    try {
        const {
            name,
            surname,
            email,
            phone,
            subject,
            message,
            product_id
        } = req.body;

        const newContact = await Contact.create({
            name,
            surname,
            email,
            phone,
            subject,
            message,
            product_id: product_id || null
        });

        return res.status(201).json({
            message: 'Contact saved successfully.',
            contact: newContact
        });
    } catch (error) {
        console.error('Error creating contact:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            include: [
                {
                    association: 'product',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        return res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByPk(id, {
            include: [
                {
                    association: 'product',
                    attributes: ['id', 'name']
                }
            ]
        });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }
        return res.json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByPk(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }
        await contact.destroy();
        return res.json({ message: 'Contact deleted successfully.' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
