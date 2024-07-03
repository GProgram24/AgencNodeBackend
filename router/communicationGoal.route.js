import express from 'express';
import CommunicationGoals from '../model/communicationGoals.model.js';

const router = express.Router();

// Create one communication goal
router.post('/', async (req, res) => {
    const communicationGoals = new CommunicationGoals(req.body);

    try {
        const newCommunicationGoals = await communicationGoals.save();
        res.status(201).json(newCommunicationGoals);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
