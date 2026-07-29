import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

// Only the first name + last-initial is ever returned — referral counts are
// social-proof material, not a directory of full identities.
function displayName(fullName) {
  const parts = (fullName || "").trim().split(/\s+/);
  if (!parts.length || !parts[0]) return "Anonymous";
  const first = parts[0];
  const lastInitial = parts.length > 1 ? `${parts[parts.length - 1][0]}.` : "";
  return lastInitial ? `${first} ${lastInitial}` : first;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const results = await User.aggregate([
    { $match: { isPaid: true, referredBy: { $ne: null } } },
    { $group: { _id: "$referredBy", invitedCount: { $sum: 1 } } },
    { $sort: { invitedCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "referrer",
      },
    },
    { $unwind: "$referrer" },
  ]);

  const top = results.map((r, i) => ({
    rank: i + 1,
    name: displayName(r.referrer.name),
    invitedCount: r.invitedCount,
    isYou: String(r._id) === String(session.user.id),
  }));

  const myCount = await User.countDocuments({ referredBy: session.user.id, isPaid: true });

  return NextResponse.json({ top, myInvitedCount: myCount });
}
