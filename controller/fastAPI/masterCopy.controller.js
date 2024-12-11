import masterCopySchema from "../../model/masterCopy.model.js";

export const createMasterCopy = async ({
  productId,
  masterCopy,
  targetAudienceName,
  verticalName,
  finalizedBy,
  thresholdRating,
}) => {
  try {
    console.log("Creating MasterCopy with data:", {
      productId,
      masterCopy,
      targetAudienceName,
      verticalName,
      finalizedBy,
      thresholdRating,
    });

    // Create the MasterCopy document
    const newMasterCopy = new masterCopySchema({
      productId,
      masterCopy,
      targetAudienceName,
      verticalName,
      finalizedBy,
      thresholdRating,
    });

    await newMasterCopy.save();

    console.log("MasterCopy created successfully:", newMasterCopy);
    return newMasterCopy;
  } catch (error) {
    console.error("Error creating MasterCopy:", error);
    throw error;
  }
};

export const getMasterCopy = async (req, res) => {
  try {
    const { productId, targetAudienceName, verticalName } = req.query;

    // Ensure all query parameters are provided
    if (!productId || !targetAudienceName || !verticalName) {
      return res
        .status(400)
        .json({ message: "Missing required query parameters." });
    }

    const masterCopy = await masterCopySchema
      .findOne({
        productId,
        targetAudienceName,
        verticalName,
      })
      .exec();

    if (!masterCopy) {
      return res
        .status(404)
        .json({ message: "No MasterCopy found for the specified criteria." });
    }

    res.status(200).json({ masterCopy });
  } catch (error) {
    console.error("Error fetching MasterCopy:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
