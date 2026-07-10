import { NextResponse } from "next/server";
import { verifyPurchase } from "@/lib/purchases";

export async function GET(req) {
  const ref = new URL(req.url).searchParams.get("ref");
  if (!ref) return NextResponse.json({ error: "Missing reference." }, { status: 400 });

  const result = await verifyPurchase(ref);
  if (result.status === "not_found") {
    return NextResponse.json({ error: "Purchase not found." }, { status: 404 });
  }
  return NextResponse.json(result);
}
