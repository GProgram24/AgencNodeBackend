import express from 'express';
import Sector from '../model/sector.js';

const router = express.Router();

// Create one sector
router.post('/', async (req, res) => {
    const sector = new Sector(req.body);

    try {
        const newSector = await sector.save();
        res.status(201).json(newSector);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
