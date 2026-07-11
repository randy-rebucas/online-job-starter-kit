"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inputClass, selectClass } from "@/components/formStyles";
import { CURRENT_STATUS_OPTIONS } from "@/lib/currentStatus";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, mobileNumber, facebookProfile, currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      const signInRes = await signIn("credentials", { email, password, redirect: false });
      setLoading(false);
      if (signInRes?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="auth-title">📘 Create your account</div>
        <p className="auth-sub">Start your remote career journey.</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Dela Cruz"
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="register-mobile">Mobile Number</label>
            <input
              id="register-mobile"
              name="mobileNumber"
              type="tel"
              autoComplete="tel"
              required
              className={inputClass}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="09XX XXX XXXX"
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="register-facebook">Facebook Profile</label>
            <input
              id="register-facebook"
              name="facebookProfile"
              type="text"
              required
              className={inputClass}
              value={facebookProfile}
              onChange={(e) => setFacebookProfile(e.target.value)}
              placeholder="https://facebook.com/yourprofile"
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="register-status">Current Status</label>
            <select
              id="register-status"
              name="currentStatus"
              required
              className={selectClass}
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
            >
              <option value="" disabled>Select your current status</option>
              {CURRENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
