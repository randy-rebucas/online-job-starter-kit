import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    product: { type: String, default: "starter-kit" },
    checkoutSessionId: { type: String, index: true },
    email: { type: String, trim: true, lowercase: true },
    amountPhp: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending", index: true },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
