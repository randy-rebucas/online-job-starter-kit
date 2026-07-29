// Shared status classification for the Job Application Tracker, used by both
// the trackers page (per-tracker analytics) and the dashboard (cross-page
// stale-application reminder) so the two never drift out of sync.
export const STATUS_STAGES = [
  { key: "applied", label: "Applied", match: /apply|applied|submit|sent/i, color: "var(--text-dim)", bg: "var(--border)" },
  { key: "interview", label: "Interview", match: /interview|screen|call/i, color: "#d78228", bg: "rgba(255,171,64,0.18)" },
  { key: "offer", label: "Offer", match: /offer|hired|accepted/i, color: "var(--emerald)", bg: "rgba(31,174,122,0.15)" },
  { key: "rejected", label: "Rejected", match: /reject|declin|no\b|ghost/i, color: "#e5484d", bg: "rgba(229,72,77,0.15)" },
];

export function classifyStatus(raw) {
  const text = (raw || "").trim();
  if (!text) return "applied";
  for (const stage of STATUS_STAGES) {
    if (stage.key !== "applied" && stage.match.test(text)) return stage.key;
  }
  return "applied";
}

const JOB_APP_TRACKER_ID = "jobApp";
const JOB_APP_COLS = ["Date", "Company/Client", "Role", "Platform", "Status", "Follow-up Date", "Notes"];
const STATUS_COL_INDEX = JOB_APP_COLS.indexOf("Status");
const DATE_COL_INDEX = JOB_APP_COLS.findIndex((c) => /date/i.test(c));

// Rows sitting at "Applied" more than a week after their date column.
export function getStaleApplications(trackers) {
  const rows = trackers?.[JOB_APP_TRACKER_ID] || [];
  const now = Date.now();
  return rows.filter((row) => {
    if (!row?.some((c) => (c || "").trim())) return false;
    if (classifyStatus(row[STATUS_COL_INDEX]) !== "applied") return false;
    const date = new Date(row[DATE_COL_INDEX]);
    if (Number.isNaN(date.getTime())) return false;
    return now - date.getTime() > 7 * 24 * 60 * 60 * 1000;
  });
}

export function countApplications(trackers) {
  const rows = trackers?.[JOB_APP_TRACKER_ID] || [];
  return rows.filter((row) => row?.some((c) => (c || "").trim())).length;
}
