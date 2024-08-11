import FileData from "../../model/Product/fileData.model.js";

export const saveExtractedContent = async (req, res) => {
  const { id } = req.params;
  const { extractedContent } = req.body;

  try {
    // Check if the extractedContent is an array
    if (!Array.isArray(extractedContent)) {
      return res
        .status(400)
        .json({ error: "Extracted content must be an array." });
    }

    // Find the FileData document by ID and update the extractedContent field
    const fileData = await FileData.findByIdAndUpdate(
      id,
      { extractedContent },
      { new: true } // Returns the updated document
    );

    if (!fileData) {
      return res.status(404).json({ error: "FileData not found." });
    }

    res.status(200).json({
      message: "Extracted content updated successfully.",
      data: fileData,
    });
  } catch (error) {
    console.error("Error updating extracted content:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
