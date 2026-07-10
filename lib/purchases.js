import { dbConnect } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import { retrieveCheckoutSession } from "@/lib/paymongo";
import { createDownloadToken } from "@/lib/downloadToken";
import { grantEntitlementForPurchase } from "@/lib/entitlements";

// Confirms a purchase's payment status. The webhook is the source of truth in
// production, but can't reach a local dev server without a public tunnel, so
// this also double-checks directly with PayMongo — safe to call repeatedly,
// only ever flips pending -> paid, never un-marks a paid purchase.
export async function verifyPurchase(reference) {
  await dbConnect();
  const purchase = await Purchase.findOne({ reference });
  if (!purchase) return { status: "not_found" };

  if (purchase.status === "pending" && purchase.checkoutSessionId) {
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
  }

  if (purchase.status !== "paid") return { status: purchase.status };

  return { status: "paid", downloadToken: createDownloadToken(purchase._id.toString()) };
}
