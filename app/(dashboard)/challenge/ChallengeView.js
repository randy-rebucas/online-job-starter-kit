"use client";

import { useProgress } from "@/components/ProgressContext";

export default function ChallengeView({ daily, months, finalQuestions }) {
  const { state, patch, loading } = useProgress();
  if (loading) return null;

  function toggleDaily(key, checked) {
    patch({ challenge: { ...state.challenge, daily: { ...state.challenge.daily, [key]: checked } } });
  }
  function toggleMilestone(key, checked) {
    patch({
      challenge: { ...state.challenge, milestones: { ...state.challenge.milestones, [key]: checked } },
    });
  }

  return (
    <>
      <h1 className="page-title">🏆 90-Day Career Success Challenge</h1>
      <p className="page-sub">From &quot;landed a job&quot; to confident, growing professional.</p>

      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          🗓️ Daily Missions
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
            🎁 <strong>Reward:</strong> {m.reward}
          </div>
        </div>
      ))}

      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          🪞 Final Reflection Questions
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
