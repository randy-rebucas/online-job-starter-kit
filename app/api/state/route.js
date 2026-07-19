import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import UserProgress from "@/models/UserProgress";

async function getOrCreateProgress(userId) {
  let progress = await UserProgress.findOne({ user: userId });
  if (!progress) progress = await UserProgress.create({ user: userId });
  return progress;
}

function serialize(progress) {
  return {
    roadmap: progress.roadmap || {},
    challenge: {
      daily: progress.challenge?.daily || {},
      milestones: progress.challenge?.milestones || {},
    },
    chapterChecks: progress.chapterChecks || {},
    trackers: progress.trackers || {},
    habits: progress.habits || {},
    streaks: progress.streaks || {},
    theme: progress.theme || null,
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const progress = await getOrCreateProgress(session.user.id);
  return NextResponse.json(serialize(progress));
}

const ALLOWED_FIELDS = ["roadmap", "challenge", "chapterChecks", "trackers", "habits", "streaks", "theme"];

export async function PATCH(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const update = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) update[key] = body[key];
  }
  if ("theme" in update && update.theme !== "dark" && update.theme !== "light" && update.theme !== null) {
    return NextResponse.json({ error: "theme must be 'dark', 'light', or null." }, { status: 400 });
  }
  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "No valid fields provided." }, { status: 400 });
  }

  await dbConnect();
  const progress = await UserProgress.findOneAndUpdate(
    { user: session.user.id },
    { $set: update },
    { upsert: true, returnDocument: "after" }
  );

  return NextResponse.json(serialize(progress));
}
