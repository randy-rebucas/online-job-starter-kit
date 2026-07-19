import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import FeatureSuggestion from "@/models/FeatureSuggestion";

async function requirePaidUser(session) {
  const user = await User.findById(session.user.id).select("isPaid").lean();
  return !!user?.isPaid;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  if (!(await requirePaidUser(session))) {
    return NextResponse.json({ error: "No confirmed purchase found." }, { status: 403 });
  }
  const suggestions = await FeatureSuggestion.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(
    suggestions.map((s) => ({
      id: s._id.toString(),
      text: s.text,
      status: s.status,
      createdAt: s.createdAt,
    }))
  );
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  if (!(await requirePaidUser(session))) {
    return NextResponse.json({ error: "No confirmed purchase found." }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) return NextResponse.json({ error: "Please enter a suggestion." }, { status: 400 });
  if (text.length > 1000) {
    return NextResponse.json({ error: "Suggestions are limited to 1000 characters." }, { status: 400 });
  }

  const suggestion = await FeatureSuggestion.create({ user: session.user.id, text });

  return NextResponse.json({
    id: suggestion._id.toString(),
    text: suggestion.text,
    status: suggestion.status,
    createdAt: suggestion.createdAt,
  });
}
