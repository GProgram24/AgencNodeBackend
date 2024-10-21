/*
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
            vertical: vertical,
            platform_name: reqObj.platform,
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
            const response = await axios.post(`${process.env.FASTAPI_SERVER}/sample-content`, postData, {
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
*/


import axios from "axios";
import mongoose from "mongoose";
import productServiceModel from "../../model/Brand/productService.model.js";
import productServiceMetaModel from "../../model/productServiceMeta.model.js";
import dotenv from "dotenv";

dotenv.config();

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:7000';
const verticalList = ["longform", "performance", "community", "automation"];

export const sampleTestingController = (socket, userId) => {

    // Initial content generation event handler
    socket.on('init', async (initData) => {
        const reqVertical = initData.vertical;
        const vertical = reqVertical ? reqVertical.toLowerCase() : '';

        if (verticalList.includes(vertical) && (Object.keys(initData).length > 4 && mongoose.isValidObjectId(initData.productId))) {
            try {
                // Fetch product details using productId
                const productParent = await productServiceModel.findById(initData.productId);
                const productDetail = await productServiceMetaModel.findOne({ productServiceId: initData.productId });

                // Data to send in the POST request
                const postData = {
                    vertical: vertical,
                    platform_name: initData.platform,
                    product_name: productParent.name,
                    description: productDetail.description,
                    feature: productDetail.feature,
                    attributes: productDetail.attributes,
                    usp: productDetail.usp,
                    target_audience: initData.audienceName,
                    age_group: `${initData.lowerAge}-${initData.upperAge}`,
                    goals_and_needs: initData.goalsAndNeeds,
                    pain_points: initData.painPoints,
                    region: initData.region,
                };

                // Send a POST request to FastAPI for initial content generation
                const response = await axios.post(`${FASTAPI_URL}/sample-content`, postData, {
                    params: { user_id: userId }
                });

                socket.emit('initResponse', response.data);
            } catch (error) {
                console.error('Error in generating initial content:', error);
                socket.emit('error', { message: 'Error generating initial content' });
            }
        } else {
            socket.emit('error', { message: 'Invalid request' });
        }
    });

    // Feedback event handler for content refinement
    socket.on('feedback', async (feedbackData) => {
        try {
            // Send feedback to FastAPI for content regeneration
            const response = await axios.post(`${FASTAPI_URL}/sample-content/feedback`, feedbackData, {
                params: { user_id: userId }
            });

            socket.emit('feedbackResponse', response.data);
        } catch (error) {
            console.error('Error in processing feedback:', error);
            socket.emit('error', { message: 'Error processing feedback' });
        }
    });
};
