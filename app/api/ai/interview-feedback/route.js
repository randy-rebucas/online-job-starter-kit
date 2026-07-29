import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

const MAX_TEXT_LENGTH = 4000;

const SYSTEM_PROMPT = `You are a supportive but honest mock interview coach. You will be given an interview question and a candidate's spoken answer (transcribed from voice, so it may include filler words or minor transcription errors — don't penalize those).

Reply with ONLY a JSON object, no preamble, matching this shape:
{"score": <1-5 integer>, "strengths": "<1-2 sentences>", "improve": "<1-2 sentences of specific, actionable feedback>"}

Score using: 5 Excellent (specific example, clear result, reflection), 4 Good (specific example, clear result, no reflection), 3 Average (general example, vague result), 2 Weak (no real example, generic), 1 Poor (off-topic or no real answer).`;

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

  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const answer = typeof body?.answer === "string" ? body.answer.trim() : "";
  if (!question) return NextResponse.json({ error: "Missing interview question." }, { status: 400 });
  if (!answer) return NextResponse.json({ error: "No answer was captured — try again." }, { status: 400 });
  if (question.length > MAX_TEXT_LENGTH || answer.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "Text is too long to review at once." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let completion;
  try {
    completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Question: ${question}\n\nCandidate's answer: ${answer}` },
      ],
    });
  } catch {
    return NextResponse.json({ error: "Couldn't reach the AI assistant. Please try again." }, { status: 502 });
  }

  const raw = completion.choices?.[0]?.message?.content?.trim() || "";
  let parsed;
  try {
    parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
  } catch {
    return NextResponse.json({ error: "The assistant didn't return valid feedback." }, { status: 502 });
  }

  const score = Number(parsed.score);
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return NextResponse.json({ error: "The assistant didn't return valid feedback." }, { status: 502 });
  }

  return NextResponse.json({
    score,
    strengths: String(parsed.strengths || ""),
    improve: String(parsed.improve || ""),
  });
}
