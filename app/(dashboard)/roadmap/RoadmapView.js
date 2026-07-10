"use client";

import { useProgress } from "@/components/ProgressContext";

export default function RoadmapView({ roadmap }) {
  const { state, patch, loading } = useProgress();
  if (loading) return null;

  const doneDays = Object.values(state.roadmap).filter(Boolean).length;
  const pct = Math.round((doneDays / 30) * 100);

  function toggleDay(day, checked) {
    patch({ roadmap: { ...state.roadmap, [day]: checked } });
  }

  return (
    <>
      <h1 className="page-title">🗓️ 30-Day Roadmap</h1>
      <p className="page-sub">
        Turn the whole kit into a daily action plan. Shift days forward if you fall behind — don&apos;t cram.
      </p>
      <div className="card">
        <div className="flex-between">
          <strong>{doneDays} / 30 days complete</strong>
          <span>{pct}%</span>
        </div>
        <div className="progress-bar" style={{ marginTop: 8 }}>
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>
      {roadmap.map((week) => (
        <div className="week-block" key={week.week}>
          <h3>{week.week}</h3>
          <div className="card" style={{ padding: "6px 16px" }}>
            {week.days.map((d) => {
              const done = !!state.roadmap[d.day];
              return (
                <div className={`day-row${done ? " done" : ""}`} key={d.day}>
                  <input
                    id={`roadmap-day-${d.day}`}
                    type="checkbox"
                    checked={done}
                    aria-labelledby={`roadmap-day-${d.day}-label`}
                    onChange={(e) => toggleDay(d.day, e.target.checked)}
                  />
                  <div>
                    <div className="day-num">
                      Day {d.day} · {d.time}
                    </div>
                    <div className="day-obj" id={`roadmap-day-${d.day}-label`}>
                      {d.obj}
                    </div>
                    <div className="day-detail">
                      {d.tasks}
                      <br />
                      <em>Expected output:</em> {d.output}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
