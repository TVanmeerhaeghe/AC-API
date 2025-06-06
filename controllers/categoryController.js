require('dotenv').config();
const { Category, Product } = require('../models');

exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const newCategory = await Category.create({ name, description, icon });
    return res.status(201).json({
      message: 'Category created successfully.',
      category: newCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

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

exports.getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [{ association: 'products' }],
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    const transformed = category.products.map(p => {
      const obj = p.toJSON();
      return {
        ...obj,
        ...makeUrls(obj),
      };
    });
    return res.json(transformed);
  } catch (error) {
    console.error('Error fetching products for category:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    category.name = name ?? category.name;
    category.description = description ?? category.description;
    category.icon = icon ?? category.icon;

    await category.save();
    return res.json({
      message: 'Category updated successfully.',
      category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    await category.destroy();
    return res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
