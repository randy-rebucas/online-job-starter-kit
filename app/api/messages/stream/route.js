import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

const ONLINE_THRESHOLD_MS = 60 * 1000;
const POLL_INTERVAL_MS = 3000;

function isOnline(user) {
  if (!user?.lastSeenAt) return false;
  return Date.now() - new Date(user.lastSeenAt).getTime() < ONLINE_THRESHOLD_MS;
}

function sseEvent(event, data) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;
  await dbConnect();

  const encoder = new TextEncoder();
  let since = new Date();
  const knownOnline = new Map();

  const stream = new ReadableStream({
    async start(controller) {
      await User.updateOne({ _id: userId }, { $set: { lastSeenAt: new Date() } });

      const tick = async () => {
        try {
          await User.updateOne({ _id: userId }, { $set: { lastSeenAt: new Date() } });

          const conversations = await Conversation.find({ participants: userId })
            .populate("participants", "name lastSeenAt")
            .lean();
          const conversationIds = conversations.map((c) => c._id);

          if (conversationIds.length) {
            const newMessages = await Message.find({
              conversation: { $in: conversationIds },
              sender: { $ne: userId },
              createdAt: { $gt: since },
            })
              .sort({ createdAt: 1 })
              .lean();

            for (const m of newMessages) {
              controller.enqueue(
                encoder.encode(
                  sseEvent("message", {
                    id: m._id.toString(),
                    conversationId: m.conversation.toString(),
                    sender: m.sender.toString(),
                    text: m.text,
                    attachments: m.attachments || [],
                    createdAt: m.createdAt,
                  })
                )
              );
            }
          }

          for (const c of conversations) {
            const other = c.participants.find((p) => p._id.toString() !== userId);
            if (!other) continue;
            const online = isOnline(other);
            const key = other._id.toString();
            if (knownOnline.get(key) !== online) {
              knownOnline.set(key, online);
              controller.enqueue(encoder.encode(sseEvent("presence", { userId: key, online })));
            }
          }

          since = new Date();
        } catch {
          // transient DB error — keep the connection alive, next tick retries
        }
      };

      await tick();
      const interval = setInterval(tick, POLL_INTERVAL_MS);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
