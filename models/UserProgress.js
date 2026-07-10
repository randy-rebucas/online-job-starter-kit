import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    roadmap: { type: mongoose.Schema.Types.Mixed, default: {} },
    challenge: {
      type: new mongoose.Schema(
        {
          daily: { type: mongoose.Schema.Types.Mixed, default: {} },
          milestones: { type: mongoose.Schema.Types.Mixed, default: {} },
        },
        { _id: false }
      ),
      default: () => ({ daily: {}, milestones: {} }),
    },
    chapterChecks: { type: mongoose.Schema.Types.Mixed, default: {} },
    trackers: { type: mongoose.Schema.Types.Mixed, default: {} },
    habits: { type: mongoose.Schema.Types.Mixed, default: {} },
    theme: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema);
