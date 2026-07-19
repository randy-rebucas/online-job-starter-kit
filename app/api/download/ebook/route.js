import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

// Lives outside public/ so it can only be reached by an authenticated, paid
// dashboard user — not by guessing or hotlinking a static URL.
const FILE_PATH = path.join(process.cwd(), "private", "downloads", "Online-Job-Starter-Kit.pdf");

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  await dbConnect();
  const user = await User.findById(session.user.id).select("isPaid").lean();
  if (!user?.isPaid) return NextResponse.json({ error: "No confirmed purchase found." }, { status: 403 });

  let file;
  try {
    file = await readFile(FILE_PATH);
  } catch {
    return NextResponse.json({ error: "The file is temporarily unavailable. Contact support." }, { status: 500 });
  }

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Online-Job-Starter-Kit.pdf"',
      "Content-Length": String(file.length),
      "Cache-Control": "private, no-store",
    },
  });
}
