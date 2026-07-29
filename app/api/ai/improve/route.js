import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

const MAX_TEXT_LENGTH = 4000;

const SYSTEM_PROMPTS = {
  resume: "You are an expert resume writer. Rewrite the given resume text to be more concise, results-driven, and use strong action verbs. Return only the improved text, no preamble or explanation.",
  cover: "You are an expert cover letter writer. Rewrite the given cover letter text to sound more confident, specific, and persuasive. Return only the improved text, no preamble or explanation.",
  proposal: "You are an expert freelance proposal writer. Rewrite the given proposal text to sound more compelling and client-focused. Return only the improved text, no preamble or explanation.",
  linkedin: "You are an expert LinkedIn profile writer. Rewrite the given LinkedIn About text to be more engaging and results-oriented. Return only the improved text, no preamble or explanation.",
  coldemail: "You are an expert cold outreach copywriter. Rewrite the given cold email text to be more compelling and concise. Return only the improved text, no preamble or explanation.",
  followup: "You are an expert business communicator. Rewrite the given follow-up email text to be warmer and more effective. Return only the improved text, no preamble or explanation.",
};

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const user = await User.findById(session.user.id).select("isPaid").lean();
  if (!user?.isPaid) return NextResponse.json({ error: "No confirmed purchase found." }, { status: 403 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "AI assistant is not configured yet." }, { status: 503 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const type = body?.type;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!SYSTEM_PROMPTS[type]) return NextResponse.json({ error: "Invalid document type." }, { status: 400 });
  if (!text) return NextResponse.json({ error: "Nothing to improve yet — write something first." }, { status: 400 });
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "Text is too long to improve at once." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let completion;
  try {
    completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[type] },
        { role: "user", content: text },
      ],
    });
  } catch {
    return NextResponse.json({ error: "Couldn't reach the AI assistant. Please try again." }, { status: 502 });
  }

  const suggestion = completion.choices?.[0]?.message?.content?.trim() || "";
  if (!suggestion) return NextResponse.json({ error: "The assistant didn't return a suggestion." }, { status: 502 });

  return NextResponse.json({ suggestion });
}
