"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { inputClass } from "@/components/formStyles";

export default function BuyKitButton({ priceLabel, defaultEmail = "" }) {
  const [email, setEmail] = useState(defaultEmail);
  const [discountCode, setDiscountCode] = useState("");
  const [showDiscount, setShowDiscount] = useState(false);
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
        body: JSON.stringify({ email, discountCode: discountCode.trim() || undefined }),
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
      {!showDiscount ? (
        <button
          type="button"
          onClick={() => setShowDiscount(true)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            textAlign: "left",
            fontSize: 12,
            color: "var(--text-dim)",
            textDecoration: "underline",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          Have a discount code?
        </button>
      ) : (
        <input
          type="text"
          className={inputClass}
          placeholder="Discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          autoCapitalize="characters"
          autoComplete="off"
        />
      )}
      <button type="submit" className="btn primary" disabled={loading}>
        {loading ? (
          "Redirecting to payment…"
        ) : (
          <>
            <Download size={16} /> Buy the Starter Kit — {priceLabel}
          </>
        )}
      </button>
      <span style={{ fontSize: 11.5, color: "var(--text-dim)" }}>Secure checkout via PayMongo — card, GCash, or Maya.</span>
    </form>
  );
}
