"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const MAX_POLLS = 6;
const POLL_INTERVAL_MS = 2500;

export default function SuccessView({ reference, initialStatus, initialToken }) {
  const [status, setStatus] = useState(initialStatus);
  const [token, setToken] = useState(initialToken || null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (status === "paid" || status === "not_found" || attempt >= MAX_POLLS) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/purchase/verify?ref=${encodeURIComponent(reference)}`);
        const data = await res.json();
        setStatus(data.status || "pending");
        if (data.downloadToken) setToken(data.downloadToken);
      } finally {
        setAttempt((a) => a + 1);
      }
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [status, attempt, reference]);

  if (status === "paid" && token) {
    return (
      <div className="card auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
        <div className="auth-title">Payment confirmed</div>
        <p className="auth-sub">Your download is ready — this link expires in 15 minutes.</p>
        <a href={`/api/download/starter-kit?token=${encodeURIComponent(token)}`} className="btn primary">
          ⬇️ Download the Starter Kit (PDF)
        </a>
        <div className="auth-footer">
          <Link href="/">Back to home</Link>
        </div>
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="card auth-card" style={{ textAlign: "center" }}>
        <div className="auth-title">We couldn&apos;t find that purchase</div>
        <p className="auth-sub">If you completed a payment, contact support with your reference number.</p>
        <div className="auth-footer" style={{ fontSize: 11 }}>{reference}</div>
        <Link href="/" className="btn primary">
          Back to home
        </Link>
      </div>
    );
  }

  if (attempt >= MAX_POLLS && status !== "paid") {
    return (
      <div className="card auth-card" style={{ textAlign: "center" }}>
        <div className="auth-title">Still waiting on payment confirmation</div>
        <p className="auth-sub">
          This is taking longer than expected. If you completed the payment, refresh this page in a minute.
        </p>
        <button className="btn primary" onClick={() => window.location.reload()}>
          Check again
        </button>
      </div>
    );
  }

  return (
    <div className="card auth-card" style={{ textAlign: "center" }}>
      <div className="auth-title">Confirming your payment&hellip;</div>
      <p className="auth-sub">This only takes a few seconds.</p>
    </div>
  );
}
