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
            // feedbackData should contain product_id
            const response = await axios.post(`${FASTAPI_URL}/sample-content/feedback`,
                {
                    product_id: feedbackData.productId,
                    feedback: feedbackData.feedback,
                    rating: feedbackData.rating,
                    ...(feedbackData.selection && { selection: feedbackData.selection }) // Include selection only if it exists
                }, {
                params: { user_id: userId }
            });

            // Check if the response message indicates completion of sample testing
            if (response.data == 'Sample testing completed') {
                socket.emit('feedbackResponse', 'Sample testing completed');
                socket.disconnect();  // Disconnect the socket as it's no longer needed
            } else {
                // Emit the feedback response data for further refinement
                socket.emit('feedbackResponse', response.data);
            }
        } catch (error) {
            console.error('Error in processing feedback:', error);
            socket.emit('error', { message: 'Error processing feedback' });
        }
    });
};
