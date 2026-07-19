import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    mobileNumber: { type: String, required: true, trim: true },
    facebookProfile: { type: String, required: true, trim: true },
    currentStatus: {
      type: String,
      required: true,
      enum: ["student", "employed", "unemployed", "freelancer", "business_owner"],
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    referralCode: { type: String, unique: true, sparse: true, index: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
