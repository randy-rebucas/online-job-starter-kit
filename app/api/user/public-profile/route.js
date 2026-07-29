import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { getOrCreatePublicSlug } from "@/lib/publicProfile";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const user = await User.findById(session.user.id).select("isPublicProfile publicSlug").lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const baseUrl = process.env.NEXTAUTH_URL || "";
  return NextResponse.json({
    isPublicProfile: !!user.isPublicProfile,
    url: user.publicSlug ? `${baseUrl}/u/${user.publicSlug}` : null,
  });
}

export async function PATCH(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (typeof body?.isPublicProfile !== "boolean") {
    return NextResponse.json({ error: "isPublicProfile must be a boolean." }, { status: 400 });
  }

  await dbConnect();

  let slug = null;
  if (body.isPublicProfile) {
    slug = await getOrCreatePublicSlug(session.user.id);
  }

  const updated = await User.findByIdAndUpdate(
    session.user.id,
    { $set: { isPublicProfile: body.isPublicProfile } },
    { new: true }
  ).select("publicSlug");

  const baseUrl = process.env.NEXTAUTH_URL || "";
  return NextResponse.json({
    isPublicProfile: body.isPublicProfile,
    url: (slug || updated?.publicSlug) ? `${baseUrl}/u/${slug || updated.publicSlug}` : null,
  });
}
