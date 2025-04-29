const { Product } = require('../models');

exports.createProduct = async (req, res) => {
  try {
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
    let imagePath = null;
    let videoPath = null;
    if (req.files) {
      if (req.files.image) {
        imagePath = req.files.image[0].path;
      }
      if (req.files.video) {
        videoPath = req.files.video[0].path;
      }
    }
    const newProduct = await Product.create({
      name,
      description,
      category_id,
      condition,
      price,
      sell_state,
      images: imagePath,
      video: videoPath,
      quantity,
      material,
      style,
    });
    return res.status(201).json({
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.json(products);
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
    return res.json(product);
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
    let imagePath = product.images;
    let videoPath = product.video;
    if (req.files) {
      if (req.files.image) {
        imagePath = req.files.image[0].path;
      }
      if (req.files.video) {
        videoPath = req.files.video[0].path;
      }
    }
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.category_id = category_id ?? product.category_id;
    product.condition = condition ?? product.condition;
    product.price = price ?? product.price;
    product.sell_state = sell_state ?? product.sell_state;
    product.quantity = quantity ?? product.quantity;
    product.material = material ?? product.material;
    product.style = style ?? product.style;
    product.images = imagePath ?? product.images;
    product.video = videoPath ?? product.video;
    await product.save();
    return res.json({
      message: 'Product updated successfully.',
      product,
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
