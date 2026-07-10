import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import SavedDocument, { DOCUMENT_TYPES } from "@/models/SavedDocument";

const MAX_DOCS_PER_TYPE = 50;

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = new URL(req.url).searchParams.get("type");
  if (type && !DOCUMENT_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid document type." }, { status: 400 });
  }

  await dbConnect();
  const query = { user: session.user.id, ...(type ? { type } : {}) };
  const docs = await SavedDocument.find(query).sort({ updatedAt: -1 }).lean();

  return NextResponse.json(
    docs.map((d) => ({
      id: d._id.toString(),
      type: d.type,
      title: d.title,
      data: d.data,
      content: d.content,
      updatedAt: d.updatedAt,
    }))
  );
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { type, title, data, content } = body || {};

  if (!DOCUMENT_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid document type." }, { status: 400 });
  }
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  await dbConnect();

  const count = await SavedDocument.countDocuments({ user: session.user.id, type });
  if (count >= MAX_DOCS_PER_TYPE) {
    return NextResponse.json(
      { error: `You can save up to ${MAX_DOCS_PER_TYPE} ${type} documents. Delete one first.` },
      { status: 409 }
    );
  }

  const doc = await SavedDocument.create({
    user: session.user.id,
    type,
    title: title.trim().slice(0, 120),
    data: data && typeof data === "object" ? data : {},
    content: typeof content === "string" ? content : "",
  });

  return NextResponse.json({
    id: doc._id.toString(),
    type: doc.type,
    title: doc.title,
    data: doc.data,
    content: doc.content,
    updatedAt: doc.updatedAt,
  });
}
