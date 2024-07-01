import express from 'express';
import Category from '../model/category.model.js';

const router = express.Router();

// Create one category
router.post('/', async (req, res) => {
    const category = new Category(req.body);

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
