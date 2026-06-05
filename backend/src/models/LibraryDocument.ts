import mongoose, { Schema, Document } from "mongoose";

export interface ILibraryDocument extends Document {
  userId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const libraryDocumentSchema = new Schema<ILibraryDocument>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, "File path is required"],
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for fetching user documents sorted by newest
libraryDocumentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.LibraryDocument ||
  mongoose.model<ILibraryDocument>("LibraryDocument", libraryDocumentSchema);
