require('dotenv').config();
const { Product } = require('../models');

const makeUrls = obj => {
  const base = process.env.BASE_URL.replace(/\/$/, '');
  const imgPath = obj.images?.replace(/\\/g, '/');
  const vidPath = obj.video?.replace(/\\/g, '/');
  return {
    imageUrl: imgPath ? `${base}/${imgPath}` : null,
    videoUrl: vidPath ? `${base}/${vidPath}` : null,
  };
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category_id, condition, price, sell_state, quantity, material, style } = req.body;

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
