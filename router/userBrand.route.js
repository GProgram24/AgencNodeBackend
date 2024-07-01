import express from 'express';
import UserBrand from '../model/userBrand.model.js';

const router = express.Router();

// Create one user brand
router.post('/', async (req, res) => {
    const userBrand = new UserBrand(req.body);

    try {
        const newUserBrand = await userBrand.save();
        res.status(201).json(newUserBrand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
