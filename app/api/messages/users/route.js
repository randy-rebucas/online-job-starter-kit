import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = new URL(req.url).searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json([]);

  await dbConnect();
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const users = await User.find({
    _id: { $ne: session.user.id },
    $or: [{ name: regex }, { email: regex }],
  })
    .select("name email")
    .limit(10)
    .lean();

  return NextResponse.json(users.map((u) => ({ id: u._id.toString(), name: u.name, email: u.email })));
}
