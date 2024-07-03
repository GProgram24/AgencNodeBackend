import express from "express";
import subBrandModel from "../model/Brand/subBrand.model.js";

const router = express.Router();

// Create one sub-brand
router.post("/", async (req, res) => {
  const subBrand = new subBrandModel(req.body);

  try {
    const newSubBrand = await subBrand.save();
    res.status(201).json(newSubBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
