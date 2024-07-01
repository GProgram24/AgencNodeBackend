import express from 'express';
import ProductService from '../model/productService.model.js';

const router = express.Router();

// Create one product service
router.post('/', async (req, res) => {
    const productService = new ProductService(req.body);

    try {
        const newProductService = await productService.save();
        res.status(201).json(newProductService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
