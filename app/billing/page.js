import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import BuyKitButton from "@/app/BuyKitButton";
import SignOutButton from "./SignOutButton";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await dbConnect();
  const user = await User.findById(session.user.id).select("isPaid").lean();
  if (!user) redirect("/login");
  if (user.isPaid) redirect("/dashboard");

  const priceLabel = `₱${process.env.STARTER_KIT_PRICE_PHP || 499}`;

  return (
    <div className="auth-wrap">
      <div className="card auth-card" style={{ textAlign: "center", maxWidth: 420 }}>
        <div className="auth-title">One-time payment required</div>
        <p className="auth-sub">
          Unlock full dashboard access and the downloadable Starter Kit PDF with a single {priceLabel} payment —
          no subscription, pay once, keep access forever.
        </p>
        <BuyKitButton priceLabel={priceLabel} defaultEmail={session.user.email} />
        <div style={{ marginTop: 16 }}>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
