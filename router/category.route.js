import express from "express";
import categoryModel from "../model/Brand/category.model.js";

const router = express.Router();

// Create one category
router.post("/", async (req, res) => {
  const category = new categoryModel(req.body);

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
