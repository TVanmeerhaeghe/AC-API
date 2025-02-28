const { Invoice, Product, Task, Customer } = require('../models');

exports.createInvoice = async (req, res) => {
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
            product_id,
            discount_name,
            discount_value
        } = req.body;

        if (!creation_date) {
            creation_date = new Date();
        }

        if (!validity_date) {
            const baseDate = new Date(creation_date);
            baseDate.setMonth(baseDate.getMonth() + 1);
            validity_date = baseDate;
        }

        const newInvoice = await Invoice.create({
            creation_date,
            validity_date,
            total_ht,
            total_tva,
            object,
            status,
            admin_note,
            customer_id,
            product_id,
            discount_name,
            discount_value
        });

        await newInvoice.reload();

        return res.status(201).json({
            message: 'Invoice created successfully.',
            invoice: newInvoice
        });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll();
        return res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByPk(id, {
            include: [
                { model: Product, as: 'product' },
                { model: Task, as: 'tasks' },
                { model: Customer, as: 'customer' }
            ]
        });
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        if (invoice.product_id) {
            invoice.dataValues.tasks = undefined;
        } else {
            invoice.dataValues.product = undefined;
        }
        return res.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        let {
            creation_date,
            validity_date,
            total_ht,
            total_tva,
            object,
            status,
            admin_note,
            customer_id,
            product_id,
            discount_name,
            discount_value
        } = req.body;

        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }

        invoice.creation_date = creation_date || invoice.creation_date;
        invoice.validity_date = validity_date || invoice.validity_date;
        invoice.total_ht = total_ht || invoice.total_ht;
        invoice.total_tva = total_tva || invoice.total_tva;
        invoice.object = object || invoice.object;
        invoice.status = status || invoice.status;
        invoice.admin_note = admin_note || invoice.admin_note;
        invoice.customer_id = customer_id || invoice.customer_id;
        invoice.product_id = (product_id !== undefined) ? product_id : invoice.product_id;
        invoice.discount_name = (discount_name !== undefined) ? discount_name : invoice.discount_name;
        invoice.discount_value = (discount_value !== undefined) ? discount_value : invoice.discount_value;

        await invoice.save();

        return res.json({
            message: 'Invoice updated successfully.',
            invoice
        });
    } catch (error) {
        console.error('Error updating invoice:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        await invoice.destroy();
        return res.json({ message: 'Invoice deleted successfully.' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
