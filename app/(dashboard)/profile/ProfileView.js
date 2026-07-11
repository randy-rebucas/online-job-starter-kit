"use client";

import { useState } from "react";
import { inputClass, selectClass } from "@/components/formStyles";
import { CURRENT_STATUS_OPTIONS } from "@/lib/currentStatus";

export default function ProfileView({ name, email, mobileNumber, facebookProfile, currentStatus }) {
  const [form, setForm] = useState({ name, mobileNumber, facebookProfile, currentStatus });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess("Profile updated.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <div className="auth-title">Profile</div>
      <p className="auth-sub">Update your contact and status details.</p>
      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label" htmlFor="profile-name">Full Name</label>
          <input
            id="profile-name"
            type="text"
            required
            className={inputClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="profile-email">Email</label>
          <input id="profile-email" type="email" disabled className={inputClass} value={email} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="profile-mobile">Mobile Number</label>
          <input
            id="profile-mobile"
            type="tel"
            required
            className={inputClass}
            value={form.mobileNumber}
            onChange={(e) => update("mobileNumber", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="profile-facebook">Facebook Profile</label>
          <input
            id="profile-facebook"
            type="text"
            required
            className={inputClass}
            value={form.facebookProfile}
            onChange={(e) => update("facebookProfile", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="profile-status">Current Status</label>
          <select
            id="profile-status"
            required
            className={selectClass}
            value={form.currentStatus}
            onChange={(e) => update("currentStatus", e.target.value)}
          >
            <option value="" disabled>Select your current status</option>
            {CURRENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
