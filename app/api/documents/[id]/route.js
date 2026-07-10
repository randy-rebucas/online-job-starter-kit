import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import SavedDocument from "@/models/SavedDocument";

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function PUT(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ error: "Invalid document id." }, { status: 400 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { title, data, content } = body || {};

  const update = {};
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title must be a non-empty string." }, { status: 400 });
    }
    update.title = title.trim().slice(0, 120);
  }
  if (data !== undefined) update.data = data && typeof data === "object" ? data : {};
  if (content !== undefined) update.content = typeof content === "string" ? content : "";

  await dbConnect();
  const doc = await SavedDocument.findOneAndUpdate(
    { _id: id, user: session.user.id },
    { $set: update },
    { returnDocument: "after" }
  );
  if (!doc) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  return NextResponse.json({
    id: doc._id.toString(),
    type: doc.type,
    title: doc.title,
    data: doc.data,
    content: doc.content,
    updatedAt: doc.updatedAt,
  });
}

export async function DELETE(_req, { params }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ error: "Invalid document id." }, { status: 400 });

  await dbConnect();
  const result = await SavedDocument.deleteOne({ _id: id, user: session.user.id });
  if (result.deletedCount === 0) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
