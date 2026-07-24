import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

const ONLINE_THRESHOLD_MS = 60 * 1000;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const since = new Date(Date.now() - ONLINE_THRESHOLD_MS);
  const users = await User.find({ _id: { $ne: session.user.id }, lastSeenAt: { $gt: since } })
    .select("name")
    .sort({ lastSeenAt: -1 })
    .limit(30)
    .lean();

  return NextResponse.json(users.map((u) => ({ id: u._id.toString(), name: u.name })));
}
