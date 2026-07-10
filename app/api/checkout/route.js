import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import { createCheckoutSession } from "@/lib/paymongo";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const amountPhp = Number(process.env.STARTER_KIT_PRICE_PHP || 499);
  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const reference = crypto.randomUUID();

  await dbConnect();
  const purchase = await Purchase.create({ reference, email: email || undefined, amountPhp, status: "pending" });

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
