import axios from "axios";
import mongoose from "mongoose";
import productServiceModel from "../../model/Brand/productService.model.js";
import productServiceMetaModel from "../../model/productServiceMeta.model.js";
import dotenv from "dotenv";
import { createMasterCopy } from "./masterCopy.controller.js";

dotenv.config();

const FASTAPI_URL = "http://localhost:7000";
const verticalList = ["longform", "performance", "community", "automation"];

// In-memory store for initial payloads
const tempMasterCopyData = new Map();

export const sampleTestingController = (socket, userId) => {
  console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);

  // Handle initial content generation and store essential data
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
        const productParent = await productServiceModel.findById(
          initData.productId
        );
        const productDetail = await productServiceMetaModel.findOne({
          productServiceId: initData.productId,
        });

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

        console.log("Storing initial data in tempMasterCopyData...");
        tempMasterCopyData.set(userId, {
          taskId: initData.taskId,
          productId: initData.productId,
          targetAudienceName: initData.audienceName,
          verticalName: initData.vertical,
        });

        console.log(
          `Stored data for userId: ${userId}`,
          tempMasterCopyData.get(userId)
        );

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

  // Handle feedback and finalize content
  socket.on("feedback", async (feedbackData) => {
    console.log("Received 'feedback' event with data:", feedbackData);

    try {
      // Prepare payload for FastAPI
      const payload = {
        product_id: feedbackData.productId,
        feedback: feedbackData.feedback,
        rating: feedbackData.rating,
        ...(feedbackData.selection && { selection: feedbackData.selection }),
        vertical_name: feedbackData.vertical_name,
      };

      console.log("Payload sent to FastAPI:", payload);

      // Send feedback to FastAPI
      const response = await axios.post(
        `${FASTAPI_URL}/sample-content/feedback`,
        payload,
        { params: { user_id: userId } }
      );

      console.log("Response from FastAPI:", response.data);

      const responseData = JSON.parse(response.data);
      console.log("Finalized flag:", responseData.finalized);

      // Check if content is finalized
      if (responseData.finalized) {
        console.log("Content finalized. Preparing MasterCopy...");

        const masterCopyData = {
          productId: feedbackData.productId,
          masterCopy: responseData.updatedContent,
          verticalName: feedbackData.vertical_name,
          finalizedBy: userId,
          thresholdRating: feedbackData.rating,
          targetAudienceName: feedbackData.audienceName,
        };

        console.log("MasterCopy data prepared:", masterCopyData);

        try {
          await createMasterCopy(masterCopyData); // Directly pass masterCopyData
          console.log("MasterCopy saved successfully.");
          socket.emit("feedbackResponse", "Sample testing completed");
        } catch (error) {
          console.error("Error while saving MasterCopy:", error);
          socket.emit("error", { message: "Error saving MasterCopy" });
        }
      } else {
        console.log("Updated content", response.data);

        const responseData = JSON.parse(response.data);
        console.log("Parsed response data:", responseData.updatedContent);

        socket.emit("feedbackResponse", responseData.updatedContent);
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
    console.log(
      "Current tempMasterCopyData before deletion:",
      Array.from(tempMasterCopyData.entries())
    );
    // tempMasterCopyData.delete(userId);
  });
};
