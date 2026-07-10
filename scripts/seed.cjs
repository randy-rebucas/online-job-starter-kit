const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });
const bcrypt = require("bcryptjs");
const DATA = require("./seed-data.cjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ojsk";

const ContentSchema = new mongoose.Schema(
  { key: { type: String, required: true, unique: true }, data: mongoose.Schema.Types.Mixed },
  { timestamps: true }
);
const Content = mongoose.models.Content || mongoose.model("Content", ContentSchema);

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true, trim: true },
    passwordHash: String,
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to", MONGODB_URI);

  const entries = Object.entries(DATA);
  for (const [key, data] of entries) {
    await Content.findOneAndUpdate({ key }, { key, data }, { upsert: true, returnDocument: "after" });
    console.log(`Seeded content: ${key}`);
  }

  const demoEmail = "demo@ojsk.dev";
  const existing = await User.findOne({ email: demoEmail });
  if (!existing) {
    const passwordHash = await bcrypt.hash("demo1234", 10);
    await User.create({ name: "Demo User", email: demoEmail, passwordHash });
    console.log(`Created demo user: ${demoEmail} / demo1234`);
  } else {
    console.log("Demo user already exists");
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
