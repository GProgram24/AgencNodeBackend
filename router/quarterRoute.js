import express from 'express';
import Quarter from '../model/quarter.js';

const router = express.Router();

// Create one quarter
router.post('/', async (req, res) => {
    const quarter = new Quarter(req.body);

    try {
        const newQuarter = await quarter.save();
        res.status(201).json(newQuarter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
