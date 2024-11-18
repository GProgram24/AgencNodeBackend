import axios from "axios";
import mongoose, { mongo } from "mongoose";
import productServiceModel from "../../model/Brand/productService.model.js";
import productServiceMetaModel from "../../model/productServiceMeta.model.js";
import dotenv from "dotenv";
import creationModel from "../../model/Project/creation.model.js";
import creatorModel from "../../model/User/creator.model.js";
dotenv.config();

export const makeIdea = async (req, res) => {
  const reqObj = req.body;
  let productId;
  let creatorId;
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
    } 
    else {
      return res.status(400).json({
        message:
          "Invalid request: Product name or valid product ID is required",
      });
    }

    if(reqObj.creatorId && mongoose.isValidObjectId(reqObj.creatorId)){
      const creator = await creatorModel.findById(reqObj.creatorId);
      if(!creator){
        return res.status(404).json({message: "Creator not found"})
      }
      creatorId = reqObj.creatorId;
    } else{
      return res.status(400).json({
        message: "Valid ID is required",
      })
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
      product_id: productId,
    };

    try {
      // Send a POST request to FastAPI
      const response = await axios.post(
        `${process.env.FASTAPI_SERVER}/idea`,
        postData
      );

      const responseData = response.data.content || [];

      const newCreation = new creationModel({
        creatorId: creatorId,
        inputs:{
          targetAudience: reqObj.audienceName,
          tone: reqObj.tone,
          touchpoint: reqObj.touchpoint,
          product: productParent.name,
          goal: reqObj.goal,
        },
        idea: reqObj.userIdea,
        contentPieces: responseData.map(item => ({
          label: item.label,
          content: item.content.map(contentItem => ({
            id: contentItem.id,
            text: contentItem.text,
          }))
        }))
      })

      await newCreation.save();

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



export const getAllCreations = async (req, res) => {
  const {creationId} = req.params;
  if(!creationId){
    return res.status(401).json({
      message: "Creation ID not found"
    })
  } else if(!mongoose.isValidObjectId(creationId)){
    return res.status(401).json({
      message: "Invalid creation ID"
    })
  }
  try{
     const isCreation = await creationModel.findById(creationId)
     if(!isCreation) return res.status(404).json({message: "Creator not found"})
    return res.status(200).send(isCreation)

  } catch(err){
    console.error(err);
    return res.status(500).json({message: err.message});
  }
}