import { dbConnect } from "@/lib/mongodb";
import DiscountCode from "@/models/DiscountCode";

const MIN_AMOUNT_PHP = 1;

export class DiscountError extends Error {}

// Never trust a client-supplied discount amount — always recompute from the
// stored DiscountCode record.
export async function applyDiscountCode(rawCode, baseAmountPhp) {
  if (!rawCode || typeof rawCode !== "string" || !rawCode.trim()) {
    return { amountPhp: baseAmountPhp, discount: null };
  }

  await dbConnect();
  const code = rawCode.trim().toUpperCase();
  const doc = await DiscountCode.findOne({ code });

  if (!doc) throw new DiscountError("Invalid discount code.");
  if (!doc.active) throw new DiscountError("This discount code is no longer active.");
  if (doc.expiresAt && doc.expiresAt.getTime() < Date.now()) {
    throw new DiscountError("This discount code has expired.");
  }

  let amountPhp =
    doc.type === "percent" ? baseAmountPhp * (1 - doc.value / 100) : baseAmountPhp - doc.value;
  amountPhp = Math.max(MIN_AMOUNT_PHP, Math.round(amountPhp * 100) / 100);

  return { amountPhp, discount: { code: doc.code, type: doc.type, value: doc.value } };
}
