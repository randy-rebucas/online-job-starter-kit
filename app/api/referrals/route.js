import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { REFERRAL_TIERS, getOrCreateReferralCode } from "@/lib/referral";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  let code;
  try {
    code = await getOrCreateReferralCode(session.user.id);
  } catch (err) {
    console.error("Failed to get/create referral code:", err);
    return NextResponse.json({ error: "Couldn't load your referral link. Please try again." }, { status: 500 });
  }

  const invitedCount = await User.countDocuments({ referredBy: session.user.id, isPaid: true });

  const baseUrl = process.env.NEXTAUTH_URL || "";
  return NextResponse.json({
    code,
    url: `${baseUrl}/register?ref=${code}`,
    invitedCount,
    tiers: REFERRAL_TIERS.map((t) => ({ ...t, earned: invitedCount >= t.count })),
  });
}
