import Product from '../models/Product.js';

export const getProducts = (req, res) => {
    const products = Product.findAll();
    res.json(products);
};

export const getProductBySlug = (req, res) => {
    const { slug } = req.params;
    const product = Product.findBySlug(slug);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export const createProduct = (req, res) => {
    const { name, slug, description, price, categoryId } = req.body;
    const newProduct = Product.create({ name, slug, description, price, categoryId });
    res.status(201).json(newProduct);
};

export const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, slug, description, price, categoryId } = req.body;
    const updatedProduct = Product.update(id, { name, slug, description, price, categoryId });
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export const deleteProduct = (req, res) => {
    const { id } = req.params;
    const deletedProduct = Product.delete(id);
    if (deletedProduct) {
        res.json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};
