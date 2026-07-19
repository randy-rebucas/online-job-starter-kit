import crypto from "crypto";
import User from "@/models/User";

// No admin UI exists yet for this app (same as DiscountCode/FeatureSuggestion)
// — the 3 non-"auto" rewards below are fulfilled by a human once earned.
export const REFERRAL_TIERS = [
  { count: 5, reward: "Unlock Premium Prompt Pack", auto: true },
  { count: 10, reward: "Free Resume Review", auto: false },
  { count: 20, reward: "1-on-1 Career Coaching", auto: false },
  { count: 50, reward: "Lifetime Premium Access", auto: false },
];

function randomCode() {
  return crypto.randomBytes(5).toString("hex");
}

// Lazily backfills a referralCode for users created before this feature
// existed, instead of requiring a one-off migration script.
export async function getOrCreateReferralCode(userId) {
  const existing = await User.findById(userId).select("referralCode").lean();
  if (existing?.referralCode) return existing.referralCode;

  // Two concurrent requests (e.g. React Strict Mode's double effect in dev)
  // can both reach here before either has written — the unique index on
  // referralCode turns a collision into a clean E11000 to retry on, instead
  // of silently returning no code.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    try {
      const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { referralCode: code } },
        { new: true }
      ).select("referralCode");
      if (updated?.referralCode) return updated.referralCode;
    } catch (err) {
      if (err?.code === 11000) continue;
      throw err;
    }
  }
  throw new Error("Could not generate a unique referral code.");
}
