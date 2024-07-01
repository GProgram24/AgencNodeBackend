import express from 'express';
import Technology from '../model/technology.model.js';

const router = express.Router();

// Create one technology
router.post('/', async (req, res) => {
    const technology = new Technology(req.body);

    try {
        const newTechnology = await technology.save();
        res.status(201).json(newTechnology);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
