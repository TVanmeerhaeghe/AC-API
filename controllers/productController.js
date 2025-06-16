require('dotenv').config();
const { Product } = require('../models');
const { Op } = require('sequelize');

const makeUrls = obj => {
  const base = process.env.BASE_URL.replace(/\/$/, '');
  let paths = [];

  try {
    paths = JSON.parse(obj.images || '[]');
  } catch {
    if (obj.images) paths = [obj.images];
  }

  const imageUrls = paths.map(p =>
    `${base}/${p.replace(/\\/g, '/')}`
  );

  const vidPath = obj.video?.replace(/\\/g, '/');
  const videoUrl = vidPath ? `${base}/${vidPath}` : null;

  return {
    imageUrl: imageUrls[0] || null,
    imageUrls,
    videoUrl
  };
};


exports.createProduct = async (req, res) => {
  try {
    const { name, description, category_id, condition, price, sell_state, quantity, material, style, buy_by } = req.body;

    const imagePaths = (req.files.images || []).map(f => f.path);
    const videoPath = req.files.video?.[0]?.path || null;

    const newProduct = await Product.create({
      name,
      description,
      category_id,
      condition,
      price,
      sell_state,
      images: JSON.stringify(imagePaths),
      video: videoPath,
      quantity,
      material,
      style,
      buy_by: buy_by !== undefined ? parseInt(buy_by, 10) || null : null,
    });

    const obj = newProduct.toJSON();
    return res.status(201).json({
      message: 'Product created successfully.',
      ...makeUrls(obj),
      ...obj,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    const transformed = products.map(p => {
      const obj = p.toJSON();
      return {
        ...obj,
        ...makeUrls(obj),
      };
    });
    return res.json(transformed);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const obj = product.toJSON();
    return res.json({
      ...obj,
      ...makeUrls(obj),
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const {
      name,
      description,
      category_id,
      condition,
      price,
      sell_state,
      quantity,
      material,
      style,
      buy_by
    } = req.body;

    let imagePaths = [];
    if (req.files && req.files.images) {
      imagePaths = req.files.images.map(f => f.path);
    } else if (product.images) {
      try {
        imagePaths = JSON.parse(product.images);
      } catch {
        imagePaths = [product.images];
      }
    }

    let videoPath = product.video;
    if (req.files && req.files.video && req.files.video[0]) {
      videoPath = req.files.video[0].path;
    }

    Object.assign(product, {
      name: name ?? product.name,
      description: description ?? product.description,
      category_id: category_id ?? product.category_id,
      condition: condition ?? product.condition,
      price: price ?? product.price,
      sell_state: sell_state ?? product.sell_state,
      quantity: quantity ?? product.quantity,
      material: material ?? product.material,
      style: style ?? product.style,
      images: JSON.stringify(imagePaths),
      video: videoPath,
      buy_by: buy_by !== undefined ? parseInt(buy_by, 10) || null : product.buy_by,
    });

    await product.save();

    const obj = product.toJSON();
    return res.json({
      message: 'Product updated successfully.',
      ...makeUrls(obj),
      ...obj,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    await product.destroy();
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Le paramètre "q" est requis pour la recherche.' });
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
          { style: { [Op.like]: `%${q}%` } },
          { material: { [Op.like]: `%${q}%` } }
        ]
      }
    });

    const transformed = products.map(p => {
      const obj = p.toJSON();
      return {
        ...obj,
        ...makeUrls(obj),
      };
    });

    return res.json(transformed);
  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getSoldRevenue = async (req, res) => {
  try {
    const { period } = req.query;

    const products = await Product.findAll({
      where: { sell_state: true },
      attributes: ['id', 'price', 'quantity', 'updatedAt', 'createdAt'],
      order: [['updatedAt', 'DESC']]
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
    for (const prod of products) {
      const date = prod.updatedAt || prod.createdAt;
      const key = getKey(date);
      if (!grouped[key]) {
        grouped[key] = { total: 0, dates: [] };
      }
      grouped[key].total += (prod.price || 0) * (prod.quantity || 1);
      grouped[key].dates.push(date);
    }

    const result = Object.entries(grouped).map(([key, value]) => ({
      period: key,
      total: value.total,
      dates: value.dates
    }));

    return res.json(result);
  } catch (error) {
    console.error('Error fetching sold revenue:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports.makeUrls = makeUrls;
