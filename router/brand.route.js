import express from 'express';
import Brand from '../model/brand.model.js';

const router = express.Router();

// Create one brand
router.post('/', async (req, res) => {
    const brand = new Brand(req.body);

    try {
        const newBrand = await brand.save();
        res.status(201).json(newBrand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
