import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    product: { type: String, default: "starter-kit" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    checkoutSessionId: { type: String, index: true },
    email: { type: String, trim: true, lowercase: true },
    amountPhp: { type: Number, required: true },
    baseAmountPhp: { type: Number, default: null }, // price before discount; null when no code applied
    discountCode: { type: String, default: null },
    discountType: { type: String, enum: ["percent", "fixed", null], default: null },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending", index: true },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
