const { Category, Product } = require('../models');

/**
 * CREATE - Créer une nouvelle catégorie
 */
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = await Category.create({ name, description });
        return res.status(201).json({
            message: 'Category created successfully.',
            category: newCategory
        });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * READ - Récupérer toutes les catégories
 */
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        return res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * READ - Récupérer une catégorie par ID
 */
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

/**
 * READ - Récupérer tous les produits d'une catégorie
 */
exports.getCategoryProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id, {
            include: [{
                association: 'products'
            }]
        });
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        return res.json(category.products);
    } catch (error) {
        console.error('Error fetching products for category:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * UPDATE - Mettre à jour une catégorie
 */
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        if (name !== undefined) category.name = name;
        if (description !== undefined) category.description = description;
        await category.save();
        return res.json({
            message: 'Category updated successfully.',
            category
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * DELETE - Supprimer une catégorie
 */
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
