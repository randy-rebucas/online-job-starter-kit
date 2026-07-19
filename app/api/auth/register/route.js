import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";
import { reconcileUserPayment } from "@/lib/entitlements";
import { CURRENT_STATUS_VALUES } from "@/lib/currentStatus";
import { getOrCreateReferralCode } from "@/lib/referral";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { name, email, password, mobileNumber, facebookProfile, currentStatus, referralCode } = body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof mobileNumber !== "string" ||
    typeof facebookProfile !== "string" ||
    typeof currentStatus !== "string"
  ) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!name.trim() || !email.trim() || !password || !mobileNumber.trim() || !facebookProfile.trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  if (!CURRENT_STATUS_VALUES.includes(currentStatus)) {
    return NextResponse.json({ error: "Please select a valid current status." }, { status: 400 });
  }

  await dbConnect();
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  let referredBy = null;
  if (typeof referralCode === "string" && referralCode.trim()) {
    const referrer = await User.findOne({ referralCode: referralCode.trim() }).select("_id").lean();
    if (referrer) referredBy = referrer._id;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    mobileNumber: mobileNumber.trim(),
    facebookProfile: facebookProfile.trim(),
    currentStatus,
    referredBy,
  });
  await UserProgress.create({ user: user._id });
  await reconcileUserPayment(user);
  await getOrCreateReferralCode(user._id);

  return NextResponse.json({ ok: true });
}
