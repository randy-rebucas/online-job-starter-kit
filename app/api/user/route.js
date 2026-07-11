import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { CURRENT_STATUS_VALUES } from "@/lib/currentStatus";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const user = await User.findById(session.user.id)
    .select("name email mobileNumber facebookProfile currentStatus")
    .lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    facebookProfile: user.facebookProfile,
    currentStatus: user.currentStatus,
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
  const { name, mobileNumber, facebookProfile, currentStatus } = body || {};

  if (
    typeof name !== "string" ||
    typeof mobileNumber !== "string" ||
    typeof facebookProfile !== "string" ||
    typeof currentStatus !== "string"
  ) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!name.trim() || !mobileNumber.trim() || !facebookProfile.trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!CURRENT_STATUS_VALUES.includes(currentStatus)) {
    return NextResponse.json({ error: "Please select a valid current status." }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findByIdAndUpdate(
    session.user.id,
    {
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      facebookProfile: facebookProfile.trim(),
      currentStatus,
    },
    { new: true }
  )
    .select("name email mobileNumber facebookProfile currentStatus")
    .lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    facebookProfile: user.facebookProfile,
    currentStatus: user.currentStatus,
  });
}
