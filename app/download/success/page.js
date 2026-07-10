import { auth } from "@/auth";
import { verifyPurchase } from "@/lib/purchases";
import SuccessView from "./SuccessView";

export default async function DownloadSuccessPage({ searchParams }) {
  const { ref } = await searchParams;

  if (!ref) {
    return (
      <div className="auth-wrap">
        <div className="card auth-card" style={{ textAlign: "center" }}>
          <div className="auth-title">Missing purchase reference</div>
          <p className="auth-sub">This page is reached after completing checkout.</p>
        </div>
      </div>
    );
  }

  const [session, result] = await Promise.all([auth(), verifyPurchase(ref)]);

  return (
    <div className="auth-wrap">
      <SuccessView
        reference={ref}
        initialStatus={result.status}
        initialToken={result.downloadToken}
        loggedIn={!!session?.user}
      />
    </div>
  );
}
