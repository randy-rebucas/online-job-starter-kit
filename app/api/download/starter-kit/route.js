import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { dbConnect } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import { verifyDownloadToken } from "@/lib/downloadToken";

// Lives outside public/ specifically so it can never be reached by guessing
// or hotlinking a static URL — the only way in is a verified, short-lived,
// single-purpose token minted after a confirmed PayMongo payment.
const FILE_PATH = path.join(process.cwd(), "private", "downloads", "Online-Job-Starter-Kit.pdf");

export async function GET(req) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing download token." }, { status: 400 });

  const decoded = verifyDownloadToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid or expired download link." }, { status: 403 });

  await dbConnect();
  const purchase = await Purchase.findById(decoded.purchaseId);
  if (!purchase || purchase.status !== "paid") {
    return NextResponse.json({ error: "No confirmed purchase found for this link." }, { status: 403 });
  }

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
