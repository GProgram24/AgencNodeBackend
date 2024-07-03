import express from 'express';
import ProductServiceMeta from '../model/productServiceMeta.model.js';

const router = express.Router();

// Create one product service meta
router.post('/', async (req, res) => {
    const productServiceMeta = new ProductServiceMeta(req.body);

    try {
        const newProductServiceMeta = await productServiceMeta.save();
        res.status(201).json(newProductServiceMeta);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
