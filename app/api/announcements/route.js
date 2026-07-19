import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Announcement from "@/models/Announcement";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const user = await User.findById(session.user.id).select("isPaid").lean();
  if (!user?.isPaid) return NextResponse.json({ error: "No confirmed purchase found." }, { status: 403 });

  const announcements = await Announcement.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json(
    announcements.map((a) => ({
      id: a._id.toString(),
      title: a.title,
      body: a.body,
      createdAt: a.createdAt,
    }))
  );
}
