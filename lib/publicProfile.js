import crypto from "crypto";
import User from "@/models/User";

function slugify(name) {
  const base = (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "user";
}

// Lazily backfills a publicSlug the first time a user turns their profile
// public, instead of requiring every existing account to have one.
export async function getOrCreatePublicSlug(userId) {
  const existing = await User.findById(userId).select("publicSlug name").lean();
  if (existing?.publicSlug) return existing.publicSlug;

  const base = slugify(existing?.name);
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = attempt === 0 ? "" : `-${crypto.randomBytes(2).toString("hex")}`;
    const slug = `${base}${suffix}`;
    try {
      const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { publicSlug: slug } },
        { new: true }
      ).select("publicSlug");
      if (updated?.publicSlug) return updated.publicSlug;
    } catch (err) {
      if (err?.code === 11000) continue;
      throw err;
    }
  }
  throw new Error("Could not generate a unique public profile link.");
}
