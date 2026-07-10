"use client";

import { useState } from "react";
import { inputClass } from "@/components/formStyles";

export default function BuyKitButton({ priceLabel }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Couldn't start checkout. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Couldn't reach the payment provider. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleBuy} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360 }}>
      {error && <div className="auth-error">{error}</div>}
      <input
        type="email"
        className={inputClass}
        placeholder="you@example.com (for your receipt)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <button type="submit" className="btn primary" disabled={loading}>
        {loading ? "Redirecting to payment…" : `⬇️ Buy the Starter Kit — ${priceLabel}`}
      </button>
      <span style={{ fontSize: 11.5, color: "var(--text-dim)" }}>Secure checkout via PayMongo — card, GCash, or Maya.</span>
    </form>
  );
}
