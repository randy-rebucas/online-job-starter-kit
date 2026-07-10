const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ojsk";

function maskUri(uri) {
  try {
    return uri.replace(/\/\/([^:@/]+):([^@/]+)@/, "//$1:****@");
  } catch {
    return uri;
  }
}

const DiscountCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);
const DiscountCode = mongoose.models.DiscountCode || mongoose.model("DiscountCode", DiscountCodeSchema);

const CODES = [{ code: "LAUNCH20", type: "percent", value: 20, active: true, expiresAt: null }];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to", maskUri(MONGODB_URI));

  for (const c of CODES) {
    await DiscountCode.findOneAndUpdate(
      { code: c.code.toUpperCase() },
      { ...c, code: c.code.toUpperCase() },
      { upsert: true, returnDocument: "after" }
    );
    console.log(`Seeded discount code: ${c.code}`);
  }

  console.log("Discount seed complete.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
