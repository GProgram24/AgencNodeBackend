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

const FASTAPI_URL = "http://localhost:7000";
const verticalList = ["longform", "performance", "community", "automation"];

export const sampleTestingController = (socket, userId) => {
  console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);

  // Initial content generation event handler
  socket.on("init", async (initData) => {
    console.log("Received 'init' event with data:", initData);

    const reqVertical = initData.vertical;
    const vertical = reqVertical ? reqVertical.toLowerCase() : "";

    if (
      verticalList.includes(vertical) &&
      Object.keys(initData).length > 4 &&
      mongoose.isValidObjectId(initData.productId)
    ) {
      console.log(`Valid 'init' request for vertical: ${vertical}`);

      try {
        console.log(
          `Fetching product details for productId: ${initData.productId}`
        );

        // Fetch product details using productId
        const productParent = await productServiceModel.findById(
          initData.productId
        );
        const productDetail = await productServiceMetaModel.findOne({
          productServiceId: initData.productId,
        });

        console.log("Fetched productParent:", productParent);
        console.log("Fetched productDetail:", productDetail);

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

        console.log("Sending POST request to FastAPI with data:", postData);

        // Send a POST request to FastAPI for initial content generation
        const response = await axios.post(
          `${FASTAPI_URL}/sample-content`,
          postData,
          {
            params: { user_id: userId },
          }
        );

        console.log("Response from FastAPI:", response.data);

        socket.emit("initResponse", response.data);
      } catch (error) {
        console.error(
          "Error in generating initial content:",
          error.response?.data || error.message
        );
        socket.emit("error", { message: "Error generating initial content" });
      }
    } else {
      console.warn("Invalid 'init' request received.");
      socket.emit("error", { message: "Invalid request" });
    }
  });

  // Feedback event handler for content refinement
  socket.on("feedback", async (feedbackData) => {
    console.log("Received 'feedback' event with data:", feedbackData);

    try {
      const payload = {
        product_id: feedbackData.productId,
        feedback: feedbackData.feedback,
        rating: feedbackData.rating,
        ...(feedbackData.selection && { selection: feedbackData.selection }),
      };

      console.log("Payload sent to FastAPI:", payload);

      const response = await axios.post(
        `${FASTAPI_URL}/sample-content/feedback`,
        payload,
        { params: { user_id: userId } }
      );

      console.log("Response from FastAPI:", response.data);

      if (response.data === "Sample testing completed") {
        console.log("Sample testing completed. Disconnecting socket.");
        socket.emit("feedbackResponse", "Sample testing completed");
        socket.disconnect();
      } else {
        socket.emit("feedbackResponse", response.data);
      }
    } catch (error) {
      console.error(
        "Error in processing feedback:",
        error.response?.data || error.message
      );
      socket.emit("error", { message: "Error processing feedback" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}, Socket ID: ${socket.id}`);
  });
};
