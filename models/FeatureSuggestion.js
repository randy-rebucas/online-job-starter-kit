import mongoose from "mongoose";

const FeatureSuggestionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["new", "reviewing", "planned", "done", "declined"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.models.FeatureSuggestion || mongoose.model("FeatureSuggestion", FeatureSuggestionSchema);
