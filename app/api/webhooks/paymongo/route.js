import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";

// PayMongo signs webhooks as `Paymongo-Signature: t=<ts>,te=<test_sig>,li=<live_sig>`,
// where the signed payload is `${ts}.${rawBody}`. Test mode uses `te`, live uses `li`.
function verifySignature(rawBody, header, secret) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=")));
  const { t, te, li } = parts;
  if (!t) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const candidates = [te, li].filter(Boolean);
  return candidates.some((sig) => {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

export async function POST(req) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("paymongo-signature");

  if (!verifySignature(rawBody, signatureHeader, process.env.PAYMONGO_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const type = event?.data?.attributes?.type;
  const checkoutSession = event?.data?.attributes?.data;

  if (type === "checkout_session.payment.paid" && checkoutSession?.id) {
    await dbConnect();
    await Purchase.findOneAndUpdate(
      { checkoutSessionId: checkoutSession.id },
      { $set: { status: "paid", paidAt: new Date() } }
    );
  }

  return NextResponse.json({ received: true });
}
