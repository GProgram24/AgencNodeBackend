import mongoose from "mongoose";

const fileDataSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileDownloadUrl: {
      type: String,
      required: true,
    },
    extractedContent: {
      type: mongoose.Schema.Types.Mixed, // Can store JSON or any other data type
    },
    fileMeta: {
      size: {
        type: Number, // Size of the file in bytes
      },
      type: {
        type: String, // MIME type of the file
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const FileData = mongoose.model("FileData", fileDataSchema);

export default FileData;
