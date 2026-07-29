import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { reconcileLatestPendingPurchaseForUser } from "@/lib/purchases";
import BuyKitButton from "@/app/BuyKitButton";
import SignOutButton from "./SignOutButton";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await dbConnect();
  let user = await User.findById(session.user.id).select("isPaid").lean();
  if (!user) redirect("/login");

  // Covers the user who paid but never made it back to /download/success and
  // whose webhook also missed — re-check PayMongo directly instead of leaving
  // them stuck here with no way to recover short of paying twice.
  if (!user.isPaid) {
    const nowPaid = await reconcileLatestPendingPurchaseForUser(session.user.id);
    if (nowPaid) user = await User.findById(session.user.id).select("isPaid").lean();
  }
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
