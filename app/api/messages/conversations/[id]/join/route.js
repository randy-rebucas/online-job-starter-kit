import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function POST(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await dbConnect();

  const conversation = await Conversation.findById(id);
  if (!conversation || !conversation.isGroup) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }
  if (conversation.participants.some((p) => p.toString() === session.user.id)) {
    return NextResponse.json({ error: "You are already a member of this group" }, { status: 400 });
  }
  if (conversation.joinRequests.some((p) => p.toString() === session.user.id)) {
    return NextResponse.json({ ok: true, alreadyRequested: true });
  }

  conversation.joinRequests.push(session.user.id);
  await conversation.save();

  return NextResponse.json({ ok: true });
}
