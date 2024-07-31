import productServiceModel from "../../model/Brand/productService.model.js";
import FileData from "../../model/Product/fileData.model.js";
import mongoose from "mongoose";

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
