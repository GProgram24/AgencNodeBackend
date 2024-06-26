import express from 'express';
import TargetGroup from '../model/targetGroup.js';

const router = express.Router();

// Create one target group
router.post('/', async (req, res) => {
    const targetGroup = new TargetGroup(req.body);

    try {
        const newTargetGroup = await targetGroup.save();
        res.status(201).json(newTargetGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
