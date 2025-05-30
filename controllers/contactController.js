require('dotenv').config();
const { Contact } = require('../models');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

exports.createContact = async (req, res) => {
    try {
        const {
            name, surname, email, phone,
            subject, message,
            product_id,
            website,
            recaptchaToken
        } = req.body;

        if (website) {
            return res.status(400).json({ message: 'Spam detected.' });
        }

        const resp = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`
            }
        );
        const json = await resp.json();
        if (!json.success || json.score < 0.5) {
            return res.status(400).json({ message: 'Échec du captcha.' });
        }

        const contact = await Contact.create({
            name, surname, email, phone,
            subject, message, product_id
        });

        const mailOptions = {
            from: `"Site Contact" <${process.env.SMTP_FROM}>`,
            to: process.env.CONTACT_NOTIFY_EMAIL,
            subject: `[Contact] ${subject}`,
            html: `
        <p><strong>Nom :</strong> ${name} ${surname}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Produit ID :</strong> ${product_id || 'aucun'}</p>
        <p><strong>Message :</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `
        };
        await transporter.sendMail(mailOptions);

        return res.status(201).json(contact);
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
