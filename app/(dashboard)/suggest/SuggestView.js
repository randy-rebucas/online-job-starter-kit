"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { textareaClass } from "@/components/formStyles";

const STATUS_LABELS = {
  new: "Submitted",
  reviewing: "Reviewing",
  planned: "Planned",
  done: "Done",
  declined: "Declined",
};

export default function SuggestView() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/suggestions");
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setText("");
        setSuccess("Thanks — your suggestion has been submitted!");
        refresh();
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="page-title">
        <MessageSquarePlus size={22} /> Suggest a Feature
      </h1>
      <p className="page-sub">Have an idea to make this kit better? Tell us about it below.</p>

      <div className="card" style={{ maxWidth: 560 }}>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="suggestion-text">
              Your suggestion
            </label>
            <textarea
              id="suggestion-text"
              className={textareaClass}
              placeholder="e.g. Add a Notion template for tracking clients..."
              value={text}
              maxLength={1000}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button type="submit" className="btn primary" disabled={busy || !text.trim()}>
            {busy ? "Submitting…" : "Submit Suggestion"}
          </button>
        </form>
      </div>

      <div className="section-title">Your Past Suggestions</div>
      {loading ? (
        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Loading…</div>
      ) : !suggestions.length ? (
        <div className="empty-state">You haven&apos;t submitted any suggestions yet.</div>
      ) : (
        suggestions.map((s) => (
          <div key={s.id} className="card" style={{ maxWidth: 560 }}>
            <div className="flex-between">
              <span className="badge">{STATUS_LABELS[s.status] || s.status}</span>
              <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                {new Date(s.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ marginTop: 8, fontSize: 13.5 }}>{s.text}</p>
          </div>
        ))
      )}
    </>
  );
}
