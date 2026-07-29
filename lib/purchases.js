import { dbConnect } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import { retrieveCheckoutSession } from "@/lib/paymongo";
import { createDownloadToken } from "@/lib/downloadToken";
import { grantEntitlementForPurchase } from "@/lib/entitlements";

// Re-checks a single pending purchase directly against PayMongo and flips it
// to paid (+ grants entitlement) if PayMongo confirms it. Only ever moves
// pending -> paid, never un-marks a paid purchase. No-op if already resolved
// or PayMongo is unreachable — safe to call repeatedly.
async function reconcilePendingPurchase(purchase) {
  if (!purchase || purchase.status !== "pending" || !purchase.checkoutSessionId) return purchase;
  try {
    const result = await retrieveCheckoutSession(purchase.checkoutSessionId);
    if (result.paid) {
      purchase.status = "paid";
      purchase.paidAt = new Date();
      await purchase.save();
      await grantEntitlementForPurchase(purchase);
    }
  } catch {
    // PayMongo not reachable / not configured yet — fall through with current status.
  }
  return purchase;
}

// Confirms a purchase's payment status. The webhook is the source of truth in
// production, but can't reach a local dev server without a public tunnel, so
// this also double-checks directly with PayMongo.
export async function verifyPurchase(reference) {
  await dbConnect();
  const purchase = await Purchase.findOne({ reference });
  if (!purchase) return { status: "not_found" };

  await reconcilePendingPurchase(purchase);

  if (purchase.status !== "paid") return { status: purchase.status };

  return { status: "paid", downloadToken: createDownloadToken(purchase._id.toString()) };
}

// Covers the user who paid but never landed back on /download/success (closed
// tab, dropped connection) and whose webhook also never arrived — without
// this, they'd be stuck on /billing forever since login reconciliation only
// checks for a purchase already marked "paid" in our own DB. Called from the
// billing page so isPaid still ends up set even when both of those paths miss.
export async function reconcileLatestPendingPurchaseForUser(userId) {
  await dbConnect();
  const purchase = await Purchase.findOne({ user: userId, status: "pending" }).sort({ createdAt: -1 });
  if (!purchase) return false;
  await reconcilePendingPurchase(purchase);
  return purchase.status === "paid";
}
