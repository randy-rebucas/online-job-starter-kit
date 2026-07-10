"use client";

import { useState } from "react";
import { useProgress } from "@/components/ProgressContext";

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emptyRow(n) {
  return new Array(n).fill("");
}

// Defensively re-align a saved row to the tracker's current column count, in
// case the tracker's schema (cols) ever changes after a user already has data.
function normalizeRow(row, colCount) {
  const next = row.slice(0, colCount);
  while (next.length < colCount) next.push("");
  return next;
}

function exportCsv(tracker, rows) {
  const csvLines = [
    tracker.cols.join(","),
    ...rows.map((r) => r.map((cell) => `"${(cell || "").replace(/"/g, '""')}"`).join(",")),
  ];
  const blob = new Blob([csvLines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${tracker.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Application Outcome Analytics — status colors follow the app's existing
// badge semantics (emerald = good, amber = in-progress, red = negative) so
// this doesn't introduce a second, competing color language.
const STATUS_STAGES = [
  { key: "applied", label: "Applied", match: /apply|applied|submit|sent/i, color: "var(--text-dim)", bg: "var(--border)" },
  { key: "interview", label: "Interview", match: /interview|screen|call/i, color: "#d78228", bg: "rgba(255,171,64,0.18)" },
  { key: "offer", label: "Offer", match: /offer|hired|accepted/i, color: "var(--emerald)", bg: "rgba(31,174,122,0.15)" },
  { key: "rejected", label: "Rejected", match: /reject|declin|no\b|ghost/i, color: "#e5484d", bg: "rgba(229,72,77,0.15)" },
];

function classifyStatus(raw) {
  const text = (raw || "").trim();
  if (!text) return "applied";
  for (const stage of STATUS_STAGES) {
    if (stage.key !== "applied" && stage.match.test(text)) return stage.key;
  }
  return "applied";
}

function ApplicationAnalytics({ rows, statusColIndex }) {
  const nonEmptyRows = rows.filter((r) => r.some((c) => (c || "").trim()));
  const total = nonEmptyRows.length;

  if (!total) return null;

  const counts = STATUS_STAGES.reduce((acc, s) => ({ ...acc, [s.key]: 0 }), {});
  nonEmptyRows.forEach((r) => {
    counts[classifyStatus(r[statusColIndex])]++;
  });

  const interviewed = counts.interview + counts.offer + counts.rejected;
  const interviewRate = total ? Math.round((interviewed / total) * 100) : 0;
  const offerRate = total ? Math.round((counts.offer / total) * 100) : 0;

  return (
    <div className="card">
      <div className="section-title" style={{ marginTop: 0 }}>
        📈 Application Outcomes
      </div>
      <div className="grid cols-3">
        <div className="card stat">
          <div className="num">{total}</div>
          <div className="label">Total Applications</div>
        </div>
        <div className="card stat">
          <div className="num">{interviewRate}%</div>
          <div className="label">Interview Rate</div>
        </div>
        <div className="card stat">
          <div className="num">{offerRate}%</div>
          <div className="label">Offer Rate</div>
        </div>
      </div>
      <table style={{ marginTop: 4 }}>
        <tbody>
          {STATUS_STAGES.map((s) => {
            const count = counts[s.key];
            const pct = total ? Math.round((count / total) * 100) : 0;
            return (
              <tr key={s.key}>
                <td style={{ width: 90, fontWeight: 700, color: s.color }}>{s.label}</td>
                <td>
                  <div className="progress-bar" aria-label={`${s.label}: ${count} of ${total} (${pct}%)`}>
                    <div style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </td>
                <td style={{ width: 70, textAlign: "right", color: "var(--text-dim)" }}>
                  {count} · {pct}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EditableTracker({ tracker }) {
  const { state, patch } = useProgress();
  const savedRows = state.trackers[tracker.id] || [emptyRow(tracker.cols.length)];
  const rows = savedRows.map((row) => normalizeRow(row, tracker.cols.length));

  // React keys rows by array index below, which breaks once a cell has been
  // edited: a contentEditable td's real DOM (extra text nodes from typing)
  // diverges from what React thinks it rendered, so deleting a row can leave
  // stale DOM in place instead of removing it. Stable per-row ids (independent
  // of position) force React to unmount the right DOM node instead of trying
  // to patch it in place.
  const [rowIds, setRowIds] = useState(() => rows.map(() => makeId()));
  const ids = rowIds.length === rows.length ? rowIds : rows.map((_, i) => rowIds[i] || makeId());

  function updateRows(newRows, newIds) {
    patch({ trackers: { ...state.trackers, [tracker.id]: newRows } });
    setRowIds(newIds);
  }

  function addRow() {
    updateRows([...rows, emptyRow(tracker.cols.length)], [...ids, makeId()]);
  }

  function deleteRow(ri) {
    const newRows = rows.filter((_, i) => i !== ri);
    const newIds = ids.filter((_, i) => i !== ri);
    updateRows(
      newRows.length ? newRows : [emptyRow(tracker.cols.length)],
      newIds.length ? newIds : [makeId()]
    );
  }

  function editCell(ri, ci, text) {
    const newRows = rows.map((r) => [...r]);
    newRows[ri][ci] = text;
    updateRows(newRows, ids);
  }

  const statusColIndex = tracker.cols.indexOf("Status");

  return (
    <>
      {statusColIndex !== -1 && <ApplicationAnalytics rows={rows} statusColIndex={statusColIndex} />}
      <div className="card">
        <div className="flex-between">
          <strong>{tracker.title}</strong>
          <div>
            <button className="btn small subtle" onClick={addRow}>
              + Add Row
            </button>
            <button className="btn small subtle" onClick={() => exportCsv(tracker, rows)} style={{ marginLeft: 6 }}>
              ⬇️ Export CSV
            </button>
          </div>
        </div>
        <div className="table-wrap" style={{ marginTop: 10 }}>
          <table className="editable-table">
            <thead>
              <tr>
                {tracker.cols.map((c) => (
                  <th key={c}>{c}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ids[ri]}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      contentEditable
                      suppressContentEditableWarning
                      role="textbox"
                      aria-label={`${tracker.cols[ci]}, row ${ri + 1}`}
                      onBlur={(e) => editCell(ri, ci, e.target.textContent)}
                    >
                      {cell}
                    </td>
                  ))}
                  <td>
                    <button className="btn small danger" onClick={() => deleteRow(ri)}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function HabitTracker({ days, habits }) {
  const { state, patch } = useProgress();

  function toggle(key, checked) {
    patch({ habits: { ...state.habits, [key]: checked } });
  }

  return (
    <div className="card">
      <strong>🔁 Daily Habit Tracker</strong>
      <div className="table-wrap" style={{ marginTop: 10 }}>
        <table>
          <thead>
            <tr>
              <th>Habit</th>
              {days.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, hi) => (
              <tr key={habit}>
                <td>{habit}</td>
                {days.map((d, di) => {
                  const key = `${hi}-${di}`;
                  const checked = !!state.habits[key];
                  return (
                    <td key={key} style={{ textAlign: "center" }}>
                      <input
                        id={`habit-${key}`}
                        type="checkbox"
                        checked={checked}
                        aria-label={`${habit} — ${d}`}
                        onChange={(e) => toggle(key, e.target.checked)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TrackersView({ trackers, habitDays, habitRows }) {
  const [tab, setTab] = useState(trackers[0]?.id);
  const { loading } = useProgress();
  if (loading) return null;

  return (
    <>
      <h1 className="page-title">📊 Trackers &amp; Worksheets</h1>
      <p className="page-sub">Editable tables — your entries auto-save to your account. Click a cell to edit.</p>
      <div className="tabs">
        {trackers.map((t) => (
          <button key={t.id} className={`tab-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
            {t.title}
          </button>
        ))}
        <button className={`tab-btn${tab === "habits" ? " active" : ""}`} onClick={() => setTab("habits")}>
          🔁 Daily Habit Tracker
        </button>
      </div>
      {tab === "habits" ? (
        <HabitTracker days={habitDays} habits={habitRows} />
      ) : trackers.find((t) => t.id === tab) ? (
        <EditableTracker key={tab} tracker={trackers.find((t) => t.id === tab)} />
      ) : (
        <div className="empty-state">No trackers available right now.</div>
      )}
    </>
  );
}
