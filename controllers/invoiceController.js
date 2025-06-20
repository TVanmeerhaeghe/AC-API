const { Invoice, Product, Task, Customer } = require('../models');
const { makeUrls } = require('./productController');
const { Op } = require('sequelize');

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
      discount_name,
      discount_value,
      products // Tableau [{ product_id, quantity }]
    } = req.body;

    if (!creation_date) creation_date = new Date();

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
      discount_name,
      discount_value
    });

    if (Array.isArray(products)) {
      for (const prod of products) {
        await newInvoice.addProduct(prod.product_id, { through: { quantity: prod.quantity || 1 } });
      }

      await Invoice.recalcTotals(newInvoice.id);
      await newInvoice.reload();
      await newInvoice.reload({
        include: [
          { model: Product, as: 'products', through: { attributes: ['quantity'] } }
        ]
      });
    }

    const obj = newInvoice.toJSON();
    if (obj.products && obj.products.length) {
      obj.products = obj.products.map(prod => ({
        ...prod,
        ...makeUrls(prod)
      }));
    }

    return res.status(201).json({
      message: 'Invoice created successfully.',
      invoice: obj,
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
        { model: Product, as: 'products', through: { attributes: ['quantity'] } },
        { model: Task, as: 'tasks' },
        { model: Customer, as: 'customer' },
      ],
    });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    const data = invoice.toJSON();
    if (data.products && data.products.length) {
      data.products = data.products.map(prod => ({
        ...prod,
        ...makeUrls(prod)
      }));
    }

    return res.json(data);
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
      discount_name,
      discount_value,
      products
    } = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    invoice.creation_date = creation_date ?? invoice.creation_date;
    invoice.validity_date = validity_date ?? invoice.validity_date;
    invoice.total_ht = total_ht ?? invoice.total_ht;
    invoice.total_tva = total_tva ?? invoice.total_tva;
    invoice.object = object ?? invoice.object;
    invoice.status = status ?? invoice.status;
    invoice.admin_note = admin_note ?? invoice.admin_note;
    invoice.customer_id = customer_id ?? invoice.customer_id;
    invoice.discount_name = discount_name ?? invoice.discount_name;
    invoice.discount_value = discount_value ?? invoice.discount_value;

    await invoice.save();

    if (Array.isArray(products)) {
      await invoice.setProducts([]);
      for (const prod of products) {
        await invoice.addProduct(prod.product_id, { through: { quantity: prod.quantity || 1 } });
      }

      await Invoice.recalcTotals(invoice.id);
    }

    await invoice.reload({
      include: [
        { model: Product, as: 'products', through: { attributes: ['quantity'] } }
      ]
    });

    const obj = invoice.toJSON();
    if (obj.products && obj.products.length) {
      obj.products = obj.products.map(prod => ({
        ...prod,
        ...makeUrls(prod)
      }));
    }

    return res.json({
      message: 'Invoice updated successfully.',
      invoice: obj,
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

exports.searchInvoices = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ message: 'Paramètre "q" requis pour la recherche.' });
    }

    const invoices = await Invoice.findAll({
      where: {
        [Op.or]: [
          { object: { [Op.like]: `%${q}%` } },
          { admin_note: { [Op.like]: `%${q}%` } },
        ],
      },
    });

    return res.json(invoices);
  } catch (error) {
    console.error('Error searching invoices:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getPaidRevenue = async (req, res) => {
  try {
    const { period } = req.query;

    const invoices = await Invoice.findAll({
      where: { status: 'Payé' },
      attributes: ['id', 'creation_date', 'total_ht'],
      order: [['creation_date', 'DESC']]
    });

    const getKey = (date) => {
      const d = new Date(date);
      if (period === 'week') {
        const firstDay = new Date(d.getFullYear(), 0, 1);
        const days = Math.floor((d - firstDay) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((days + firstDay.getDay() + 1) / 7);
        return `${d.getFullYear()}-S${week}`;
      }
      if (period === 'month') {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
      if (period === 'year') {
        return `${d.getFullYear()}`;
      }
      return d.toISOString().split('T')[0];
    };


    const grouped = {};
    for (const inv of invoices) {
      const key = getKey(inv.creation_date);
      if (!grouped[key]) {
        grouped[key] = { total: 0, dates: [] };
      }
      grouped[key].total += inv.total_ht || 0;
      grouped[key].dates.push(inv.creation_date);
    }

    const result = Object.entries(grouped).map(([key, value]) => ({
      period: key,
      total: value.total,
      dates: value.dates
    }));

    return res.json(result);
  } catch (error) {
    console.error('Error fetching paid revenue:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
