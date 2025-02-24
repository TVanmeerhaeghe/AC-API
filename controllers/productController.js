const { Product } = require('../models');

/**
 * CREATE - Créer un nouveau produit
 */
exports.createProduct = async (req, res) => {
    try {
        const { name, description, category_id, condition, price, sell_state } = req.body;
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
            video: videoPath
        });
        return res.status(201).json({
            message: 'Product created successfully.',
            product: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * READ - Récupérer tous les produits
 */
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * READ - Récupérer un produit par son ID
 */
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

/**
 * UPDATE - Mettre à jour un produit
 */
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        const { name, description, category_id, condition, price, sell_state } = req.body;
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
        product.name = name || product.name;
        product.description = description || product.description;
        product.category_id = category_id || product.category_id;
        product.condition = condition || product.condition;
        product.price = price || product.price;
        product.sell_state = sell_state !== undefined ? sell_state : product.sell_state;
        product.images = imagePath;
        product.video = videoPath;
        await product.save();
        return res.json({
            message: 'Product updated successfully.',
            product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * DELETE - Supprimer un produit
 */
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
