import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

const ONLINE_THRESHOLD_MS = 60 * 1000;

function isOnline(user) {
  if (!user?.lastSeenAt) return false;
  return Date.now() - new Date(user.lastSeenAt).getTime() < ONLINE_THRESHOLD_MS;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const conversations = await Conversation.find({ participants: session.user.id })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .populate("participants", "name email lastSeenAt")
    .lean();

  const results = await Promise.all(
    conversations.map(async (c) => {
      const other = c.participants.find((p) => p._id.toString() !== session.user.id);
      const unreadCount = await Message.countDocuments({
        conversation: c._id,
        sender: { $ne: session.user.id },
        readBy: { $ne: session.user.id },
      });
      return {
        id: c._id.toString(),
        otherUser: other
          ? { id: other._id.toString(), name: other.name, online: isOnline(other) }
          : null,
        lastMessagePreview: c.lastMessagePreview || "",
        lastMessageAt: c.lastMessageAt,
        unreadCount,
      };
    })
  );

  return NextResponse.json(results);
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await req.json();
  if (typeof userId !== "string" || !userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot start a conversation with yourself" }, { status: 400 });
  }

  await dbConnect();
  const otherUser = await User.findById(userId).select("name").lean();
  if (!otherUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let conversation = await Conversation.findOne({
    participants: { $all: [session.user.id, userId], $size: 2 },
  });
  if (!conversation) {
    conversation = await Conversation.create({ participants: [session.user.id, userId] });
  }

  return NextResponse.json({ id: conversation._id.toString(), otherUser: { id: userId, name: otherUser.name } });
}
