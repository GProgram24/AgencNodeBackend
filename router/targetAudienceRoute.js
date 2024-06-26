import express from 'express';
import TargetAudience from '../model/targetAudience.js';

const router = express.Router();

// Create one target audience
router.post('/', async (req, res) => {
    const targetAudience = new TargetAudience(req.body);

    try {
        const newTargetAudience = await targetAudience.save();
        res.status(201).json(newTargetAudience);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
