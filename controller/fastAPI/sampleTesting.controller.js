import axios from "axios";
import mongoose from "mongoose";
import productServiceModel from "../../model/Brand/productService.model.js";
import productServiceMetaModel from "../../model/productServiceMeta.model.js";
import dotenv from "dotenv";
dotenv.config();

const verticalList = ["longform", "performance", "community", "automation"]

export const sampleTesting = async (req, res) => {
    const reqVertical = req.query.vertical;
    const reqObj = req.body;
    const vertical = reqVertical ? reqVertical.toLowerCase() : '';
    if (verticalList.includes(vertical) && (Object.keys(reqObj).length > 4 && mongoose.isValidObjectId(reqObj.productId))) {

        // Fetch product details using productid
        const productParent = await productServiceModel.findById(reqObj.productId);
        const productDetail = await productServiceMetaModel.findOne({ productServiceId: reqObj.productId });

        // Fetch all parent name of product
        const productHierarchy = "";

        // Data to send in the POST request
        const postData = {
            hierarchy: productHierarchy,
            product_name: reqObj.productName,
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
            // Send a POST request to another URL
            const response = await axios.post(`${process.env.FASTAPI_SERVER}/prompt`, postData);
            console.log('POST request successful:', response.data);
        } catch (error) {
            console.error('Error in POST request:', error);
            return res.status(500).json({ message: "Server erro" });
        }
    } else {
        return res.status(404).json({ message: "Invalid request" });
    }
}