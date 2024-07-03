import express from 'express';
import User from '../model/user.model.js';

const router = express.Router();

// Create one user
router.post('/', async (req, res) => {
    const user = new User(req.body);

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
