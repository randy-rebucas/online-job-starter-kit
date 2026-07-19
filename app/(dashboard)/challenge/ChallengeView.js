"use client";

import { useState } from "react";
import { Trophy, Calendar, Gift, Sparkles, Award } from "lucide-react";
import { useSession } from "next-auth/react";
import { useProgress } from "@/components/ProgressContext";
import { buildCertificatePdf } from "@/lib/certificatePdf";

export default function ChallengeView({ daily, months, finalQuestions }) {
  const { state, patch, loading } = useProgress();
  const { data: session } = useSession();
  const [generating, setGenerating] = useState(false);
  if (loading) return null;

  function toggleDaily(key, checked) {
    patch({ challenge: { ...state.challenge, daily: { ...state.challenge.daily, [key]: checked } } });
  }
  function toggleMilestone(key, checked) {
    patch({
      challenge: { ...state.challenge, milestones: { ...state.challenge.milestones, [key]: checked } },
    });
  }

  const totalMilestones = months.reduce((sum, m) => sum + m.milestones.length, 0);
  const doneMilestones = Object.values(state.challenge.milestones).filter(Boolean).length;
  const doneDaily = Object.values(state.challenge.daily).filter(Boolean).length;
  const complete = doneDaily >= daily.length && doneMilestones >= totalMilestones;

  async function downloadCertificate() {
    setGenerating(true);
    try {
      const doc = await buildCertificatePdf({
        name: session?.user?.name,
        title: "90-Day Career Success Challenge",
        subtitle: "From landed a job to confident, growing professional",
      });
      doc.save("90-day-challenge-certificate.pdf");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <h1 className="page-title">
        <Trophy size={22} /> 90-Day Career Success Challenge
      </h1>
      <p className="page-sub">From &quot;landed a job&quot; to confident, growing professional.</p>

      {complete && (
        <div className="card">
          <button className="btn primary" onClick={downloadCertificate} disabled={generating}>
            <Award size={16} /> {generating ? "Generating…" : "Download Certificate"}
          </button>
        </div>
      )}

      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          <Calendar size={18} /> Daily Missions
        </div>
        {daily.map((item, i) => {
          const key = `daily-${i}`;
          const done = !!state.challenge.daily[key];
          return (
            <div className={`checklist-item${done ? " done" : ""}`} key={key}>
              <input
                id={`challenge-${key}`}
                type="checkbox"
                checked={done}
                onChange={(e) => toggleDaily(key, e.target.checked)}
              />
              <label className="label-text" htmlFor={`challenge-${key}`}>
                {item}
              </label>
            </div>
          );
        })}
      </div>

      {months.map((m, mi) => (
        <div className="card" key={m.month}>
          <h3 style={{ marginTop: 0, color: "var(--coral)" }}>{m.month}</h3>
          <p style={{ color: "var(--text-dim)", fontSize: 13.5 }}>{m.focus}</p>
          <div className="section-title" style={{ marginTop: 14 }}>
            Weekly Milestones
          </div>
          {m.milestones.map((item, i) => {
            const key = `m${mi}-${i}`;
            const done = !!state.challenge.milestones[key];
            return (
              <div className={`checklist-item${done ? " done" : ""}`} key={key}>
                <input
                  id={`challenge-${key}`}
                  type="checkbox"
                  checked={done}
                  onChange={(e) => toggleMilestone(key, e.target.checked)}
                />
                <label className="label-text" htmlFor={`challenge-${key}`}>
                  {item}
                </label>
              </div>
            );
          })}
          <div className="section-title">Monthly Review Questions</div>
          <ul style={{ fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.7 }}>
            {m.review.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <div className="callout">
            <Gift size={15} /> <strong>Reward:</strong> {m.reward}
          </div>
        </div>
      ))}

      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          <Sparkles size={18} /> Final Reflection Questions
        </div>
        <ul style={{ fontSize: 13.5, lineHeight: 1.8 }}>
          {finalQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
