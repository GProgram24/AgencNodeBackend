import express from 'express';
import UserSector from '../model/userSector.js';

const router = express.Router();

// Create one user sector
router.post('/', async (req, res) => {
    const userSector = new UserSector(req.body);

    try {
        const newUserSector = await userSector.save();
        res.status(201).json(newUserSector);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
