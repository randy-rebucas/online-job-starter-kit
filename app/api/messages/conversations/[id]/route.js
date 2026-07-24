import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

async function loadConversationForUser(id, userId) {
  const conversation = await Conversation.findById(id).lean();
  if (!conversation) return null;
  if (!conversation.participants.some((p) => p.toString() === userId)) return null;
  return conversation;
}

export async function GET(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  const conversation = await loadConversationForUser(id, session.user.id);
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = await Message.find({ conversation: id }).sort({ createdAt: 1 }).limit(200).lean();

  await Message.updateMany(
    { conversation: id, sender: { $ne: session.user.id }, readBy: { $ne: session.user.id } },
    { $addToSet: { readBy: session.user.id } }
  );

  return NextResponse.json(
    messages.map((m) => ({
      id: m._id.toString(),
      sender: m.sender.toString(),
      text: m.text,
      attachments: m.attachments || [],
      createdAt: m.createdAt,
    }))
  );
}

export async function POST(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { text, attachments } = await req.json();
  const trimmedText = typeof text === "string" ? text.trim() : "";
  const safeAttachments = Array.isArray(attachments) ? attachments.slice(0, 10) : [];

  if (!trimmedText && !safeAttachments.length) {
    return NextResponse.json({ error: "Message must have text or an attachment" }, { status: 400 });
  }

  await dbConnect();
  const conversation = await loadConversationForUser(id, session.user.id);
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const message = await Message.create({
    conversation: id,
    sender: session.user.id,
    text: trimmedText,
    attachments: safeAttachments,
    readBy: [session.user.id],
  });

  const preview = trimmedText || (safeAttachments.length ? "Sent an attachment" : "");
  await Conversation.updateOne(
    { _id: id },
    { $set: { lastMessageAt: message.createdAt, lastMessagePreview: preview.slice(0, 140) } }
  );

  return NextResponse.json({
    id: message._id.toString(),
    sender: session.user.id,
    text: message.text,
    attachments: message.attachments,
    createdAt: message.createdAt,
  });
}
