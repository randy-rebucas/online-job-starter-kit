import mongoose from "mongoose";

const DOCUMENT_TYPES = ["resume", "cover", "proposal", "linkedin", "coldemail", "followup"];

const SavedDocumentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: DOCUMENT_TYPES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

SavedDocumentSchema.index({ user: 1, type: 1, updatedAt: -1 });

export { DOCUMENT_TYPES };
export default mongoose.models.SavedDocument || mongoose.model("SavedDocument", SavedDocumentSchema);
