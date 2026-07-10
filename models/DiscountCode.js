import mongoose from "mongoose";

const DiscountCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true }, // percent: 1-100, fixed: PHP amount
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.DiscountCode || mongoose.model("DiscountCode", DiscountCodeSchema);
