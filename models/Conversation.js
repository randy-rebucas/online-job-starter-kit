import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessageAt: { type: Date, default: null },
    lastMessagePreview: { type: String, default: "" },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
