import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function POST(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { userId, action } = await req.json();
  if (!["approve", "decline"].includes(action) || typeof userId !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await dbConnect();
  const conversation = await Conversation.findById(id);
  if (!conversation || !conversation.isGroup) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }
  if (conversation.createdBy?.toString() !== session.user.id) {
    return NextResponse.json({ error: "Only the group creator can manage join requests" }, { status: 403 });
  }
  if (!conversation.joinRequests.some((p) => p.toString() === userId)) {
    return NextResponse.json({ error: "No pending request for this user" }, { status: 404 });
  }

  conversation.joinRequests = conversation.joinRequests.filter((p) => p.toString() !== userId);
  if (action === "approve" && !conversation.participants.some((p) => p.toString() === userId)) {
    conversation.participants.push(userId);
  }
  await conversation.save();

  return NextResponse.json({ ok: true });
}
