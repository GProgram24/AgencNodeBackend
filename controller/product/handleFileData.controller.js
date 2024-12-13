import productServiceModel from "../../model/Brand/productService.model.js";
import FileData from "../../model/Product/fileData.model.js";
import mongoose from "mongoose";
import redis from "redis"

const client = redis.createClient({host: "localhost", port: 6379});

client.on('connect', () => {
  console.log('Connected to Redis');
})

client.on('error', () => {
  console.log('Redis error');
})

await client.connect();

async function addFileToRedis(fileId, productId) {
  try {
    const tempStorage = "temp:file:ids";

    // Serialize fileId and productId as a JSON string
    const obj = JSON.stringify({
      fileId: fileId.toString(),
      productId: productId.toString(),
    });

    // Push JSON string to Redis list
    await client.lPush(tempStorage, obj);

    // Set expiration
    await client.expire(tempStorage, 24 * 60 * 60);

    console.log("File IDs and Product IDs uploaded to Redis successfully");
  } catch (err) {
    console.error("Failed to upload file to Redis:", err);
    throw new Error("Redis operation failed");
  }
}



// Upload a file and associate it with a product
export const uploadFile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { productId, fileName, fileDownloadUrl, extractedContent, fileMeta } =
      req.body;

    const newFileData = new FileData({
      fileName,
      fileDownloadUrl,
      extractedContent,
      fileMeta,
    });

    await newFileData.save({ session });

    const fileId = newFileData._id

    await addFileToRedis(fileId, productId);

    const product = await productServiceModel
      .findById(productId)
      .session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    product.fileDataRefs.push(newFileData._id);
    await product.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newFileData);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
