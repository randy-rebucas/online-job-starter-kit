import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

const ONLINE_THRESHOLD_MS = 60 * 1000;
const MAX_GROUP_MEMBERS = 50;

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
      const unreadCount = await Message.countDocuments({
        conversation: c._id,
        sender: { $ne: session.user.id },
        readBy: { $ne: session.user.id },
      });
      const others = c.participants.filter((p) => p._id.toString() !== session.user.id);

      const base = {
        id: c._id.toString(),
        isGroup: !!c.isGroup,
        lastMessagePreview: c.lastMessagePreview || "",
        lastMessageAt: c.lastMessageAt,
        unreadCount,
      };

      if (c.isGroup) {
        return {
          ...base,
          name: c.name,
          memberCount: c.participants.length,
          members: others.map((m) => ({ id: m._id.toString(), name: m.name, online: isOnline(m) })),
        };
      }

      const other = others[0];
      return {
        ...base,
        otherUser: other ? { id: other._id.toString(), name: other.name, online: isOnline(other) } : null,
      };
    })
  );

  return NextResponse.json(results);
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await dbConnect();

  if (Array.isArray(body.participantIds)) {
    const groupName = typeof body.groupName === "string" ? body.groupName.trim() : "";
    const memberIds = [...new Set(body.participantIds.filter((id) => typeof id === "string" && id !== session.user.id))];

    if (!groupName) return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    if (!memberIds.length) return NextResponse.json({ error: "Select at least one other member" }, { status: 400 });
    if (memberIds.length > MAX_GROUP_MEMBERS) {
      return NextResponse.json({ error: `Groups are limited to ${MAX_GROUP_MEMBERS} members` }, { status: 400 });
    }

    const members = await User.find({ _id: { $in: memberIds } }).select("name").lean();
    if (members.length !== memberIds.length) {
      return NextResponse.json({ error: "One or more selected users were not found" }, { status: 404 });
    }

    const conversation = await Conversation.create({
      participants: [session.user.id, ...memberIds],
      isGroup: true,
      name: groupName,
      createdBy: session.user.id,
    });

    return NextResponse.json({
      id: conversation._id.toString(),
      isGroup: true,
      name: groupName,
      memberCount: conversation.participants.length,
      members: members.map((m) => ({ id: m._id.toString(), name: m.name, online: false })),
    });
  }

  const { userId } = body;
  if (typeof userId !== "string" || !userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot start a conversation with yourself" }, { status: 400 });
  }

  const otherUser = await User.findById(userId).select("name").lean();
  if (!otherUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let conversation = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [session.user.id, userId], $size: 2 },
  });
  if (!conversation) {
    conversation = await Conversation.create({ participants: [session.user.id, userId] });
  }

  return NextResponse.json({
    id: conversation._id.toString(),
    isGroup: false,
    otherUser: { id: userId, name: otherUser.name },
  });
}
