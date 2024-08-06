import axios from "axios";
import mongoose from "mongoose";
import productServiceModel from "../../model/Brand/productService.model.js";
import productServiceMetaModel from "../../model/productServiceMeta.model.js";
import dotenv from "dotenv";
dotenv.config();


export const makeIdea = async (req, res) => {
    const reqObj = req.body;
    if ((Object.keys(reqObj).length > 4 && mongoose.isValidObjectId(reqObj.productId))) {

        // Fetch product details using productid
        const productParent = await productServiceModel.findById(reqObj.productId);
        const productDetail = await productServiceMetaModel.findOne({ productServiceId: reqObj.productId });

        // Fetch all parent name of product
        const productHierarchy = "";

        // Data to send in the POST request
        const postData = {
            platform_name: reqObj.touchpoint,
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
        };
        try {
            // Send a POST request to FastAPI
            const response = await axios.post(`${process.env.FASTAPI_SERVER}/idea`, postData, {
                params: { type: "generate" }
            });
            return res.status(200).send(response.data);
        } catch (error) {
            console.error('Error in generating sample testing content:', error);
            return res.status(500).json({ message: error });
        }
    } else {
        return res.status(404).json({ message: "Invalid request" });
    }
}