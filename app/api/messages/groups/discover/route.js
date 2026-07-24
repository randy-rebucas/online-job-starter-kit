import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = new URL(req.url).searchParams.get("q")?.trim() || "";

  await dbConnect();
  const filter = {
    isGroup: true,
    participants: { $ne: session.user.id },
  };
  if (q) filter.name = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const groups = await Conversation.find(filter)
    .populate("createdBy", "name")
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return NextResponse.json(
    groups.map((g) => ({
      id: g._id.toString(),
      name: g.name,
      memberCount: g.participants.length,
      creatorName: g.createdBy?.name || "Unknown",
      requested: (g.joinRequests || []).some((id) => id.toString() === session.user.id),
    }))
  );
}
