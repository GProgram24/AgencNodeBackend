import express from 'express';
import Project from '../model/project.model.js';

const router = express.Router();

// Create one project
router.post('/', async (req, res) => {
    const project = new Project(req.body);

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
