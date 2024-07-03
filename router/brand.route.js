import express from "express";
import brandModel from "../model/Brand/brand.model.js";

const router = express.Router();

// Create one brand
router.post("/", async (req, res) => {
  const brand = new brandModel(req.body);

  try {
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
