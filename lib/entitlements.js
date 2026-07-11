import User from "@/models/User";
import Purchase from "@/models/Purchase";

// Given a Purchase that just became status:"paid", mark the linked/matching
// User as paid. Idempotent — safe to call repeatedly. Caller must have
// already called dbConnect().
export async function grantEntitlementForPurchase(purchase) {
  if (!purchase || purchase.status !== "paid") return null;

  let user = null;
  if (purchase.user) {
    user = await User.findById(purchase.user);
  } else if (purchase.email) {
    user = await User.findOne({ email: purchase.email });
    if (user) {
      purchase.user = user._id; // backfill link for the guest-then-registered case
      await purchase.save();
    }
  }
  if (user && !user.isPaid) {
    // Partial update, not user.save() — save() runs full-document validation,
    // which would fail (and silently get swallowed by callers) for any
    // legacy user missing fields added to the schema after they registered.
    // Payment status must never depend on unrelated profile completeness.
    await User.updateOne(
      { _id: user._id },
      { $set: { isPaid: true, paidAt: user.paidAt || new Date() } }
    );
    user.isPaid = true;
    user.paidAt = user.paidAt || new Date();
  }
  return user;
}

// Called right after register/login: does this email already have a paid
// guest purchase we should retroactively grant?
export async function reconcileUserPayment(user) {
  if (!user || user.isPaid) return user;
  const paidPurchase = await Purchase.findOne({ email: user.email, status: "paid" });
  if (paidPurchase) return grantEntitlementForPurchase(paidPurchase);
  return user;
}
