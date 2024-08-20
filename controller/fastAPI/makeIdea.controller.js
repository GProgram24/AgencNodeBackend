import axios from "axios";
import mongoose from "mongoose";
import productServiceModel from "../../model/Brand/productService.model.js";
import productServiceMetaModel from "../../model/productServiceMeta.model.js";
import dotenv from "dotenv";
dotenv.config();

export const makeIdea = async (req, res) => {
  const reqObj = req.body;
  let productId;

  try {
    // Fetch product ID using product name if productId is not provided
    if (reqObj.productName) {
      const product = await productServiceModel.findOne({
        name: reqObj.productName,
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      productId = product._id;
    } else if (mongoose.isValidObjectId(reqObj.productId)) {
      productId = reqObj.productId;
    } else {
      return res.status(400).json({
        message:
          "Invalid request: Product name or valid product ID is required",
      });
    }

    // Fetch product details using productId
    const productParent = await productServiceModel.findById(productId);
    const productDetail = await productServiceMetaModel.findOne({
      productServiceId: productId,
    });

    if (!productParent || !productDetail) {
      return res.status(404).json({ message: "Product details not found" });
    }

    // Data to send in the POST request
    const postData = {
      touchpoint: reqObj.touchpoint,
      user_idea: reqObj.userIdea,
      goal: reqObj.goal,
      tone: reqObj.tone,
      product_name: productParent.name,
      description: productDetail.description,
      feature: productDetail.feature,
      attributes: productDetail.attributes,
      usp: productDetail.usp,
      target_audience: reqObj.audienceName,
      age_group: `${reqObj.lowerAge}-${reqObj.upperAge}`,
      goals_and_needs: reqObj.goalsAndNeeds,
      pain_points: reqObj.painPoints,
      region: reqObj.region,
      product_id: productId, // Include the product ID in the request to FastAPI
    };

    try {
      // Send a POST request to FastAPI
      const response = await axios.post(
        `${process.env.FASTAPI_SERVER}/idea`,
        postData,
        {
          params: { type: "generate" },
        }
      );
      return res.status(200).send(response.data);
    } catch (error) {
      console.error("Error in generating idea content:", error);
      return res.status(500).json({ message: error.message });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
