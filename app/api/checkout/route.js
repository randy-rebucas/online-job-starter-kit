import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import { createCheckoutSession } from "@/lib/paymongo";
import { applyDiscountCode, DiscountError } from "@/lib/discounts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const authSession = await auth();
  const sessionEmail = authSession?.user?.email?.toLowerCase().trim();

  const formEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const email = sessionEmail || formEmail;
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const discountCodeRaw = typeof body?.discountCode === "string" ? body.discountCode.trim() : "";

  const baseAmountPhp = Number(process.env.STARTER_KIT_PRICE_PHP || 499);
  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const reference = crypto.randomUUID();

  let amountPhp = baseAmountPhp;
  let appliedDiscount = null;
  if (discountCodeRaw) {
    try {
      const result = await applyDiscountCode(discountCodeRaw, baseAmountPhp);
      amountPhp = result.amountPhp;
      appliedDiscount = result.discount;
    } catch (err) {
      if (err instanceof DiscountError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }
  }

  await dbConnect();
  const purchase = await Purchase.create({
    reference,
    email: email || undefined,
    user: authSession?.user?.id || undefined,
    amountPhp,
    baseAmountPhp: appliedDiscount ? baseAmountPhp : undefined,
    discountCode: appliedDiscount?.code ?? undefined,
    discountType: appliedDiscount?.type ?? undefined,
    status: "pending",
  });

  try {
    const session = await createCheckoutSession({
      reference,
      amountPhp,
      email: email || undefined,
      successUrl: `${baseUrl}/download/success?ref=${reference}`,
      cancelUrl: `${baseUrl}/?checkout=cancelled`,
    });
    purchase.checkoutSessionId = session.id;
    await purchase.save();

    return NextResponse.json({ checkoutUrl: session.checkoutUrl });
  } catch (err) {
    purchase.status = "failed";
    await purchase.save();
    return NextResponse.json({ error: err.message || "Could not start checkout." }, { status: 502 });
  }
}
