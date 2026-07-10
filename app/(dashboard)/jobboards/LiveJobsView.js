"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/formStyles";

function timeAgo(iso) {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default function LiveJobsView({ jobs, sourceStatus, fetchedAt }) {
  const sources = useMemo(() => ["All", ...new Set(jobs.map((j) => j.source))], [jobs]);
  const [sourceFilter, setSourceFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter((j) => {
      const matchesSource = sourceFilter === "All" || j.source === sourceFilter;
      const matchesSearch =
        !q ||
        `${j.title} ${j.company} ${j.location} ${j.tags.join(" ")}`.toLowerCase().includes(q);
      return matchesSource && matchesSearch;
    });
  }, [jobs, sourceFilter, search]);

  const failedSources = Object.entries(sourceStatus).filter(([, s]) => !s.ok);

  return (
    <>
      <div className="flex-between">
        <div className="section-title" style={{ marginTop: 0 }}>
          🔴 Live Job Postings
        </div>
        {fetchedAt && (
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
            Updated {timeAgo(fetchedAt)}
          </span>
        )}
      </div>
      <p className="page-sub" style={{ marginBottom: 14 }}>
        Real, current postings pulled live from Remotive, Remote OK, and Arbeitnow&apos;s public job APIs — refreshed
        every 15 minutes. Upwork, Fiverr, and most marketplaces don&apos;t publish a public jobs API, so they aren&apos;t
        included here; see the directory below for those.
      </p>

      {failedSources.length > 0 && (
        <div className="callout">
          ⚠️ Couldn&apos;t reach {failedSources.map(([name]) => name).join(", ")} right now — showing results from the
          other sources.
        </div>
      )}

      <div className="field">
        <input
          id="livejobs-search"
          name="livejobsSearch"
          type="search"
          autoComplete="off"
          aria-label="Search live job postings"
          className={inputClass}
          placeholder="Search title, company, tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="chip-row">
        {sources.map((s) => (
          <span
            key={s}
            className={`chip${sourceFilter === s ? " active" : ""}`}
            onClick={() => setSourceFilter(s)}
          >
            {s}
          </span>
        ))}
      </div>

      {!filtered.length ? (
        <div className="empty-state">No live postings match right now — try a different search or source.</div>
      ) : (
        filtered.slice(0, 60).map((j) => (
          <div className="prompt-card" key={j.id}>
            <div className="flex-between">
              <div className="goal">
                <a href={j.url} target="_blank" rel="noopener">
                  {j.title}
                </a>{" "}
                <span className="badge">{j.source}</span>
              </div>
            </div>
            <div className="meta-row">
              <strong>{j.company}</strong> · {j.location}
              {timeAgo(j.postedAt) ? ` · ${timeAgo(j.postedAt)}` : ""}
            </div>
            {j.tags.length > 0 && (
              <div className="tip">{j.tags.join(" · ")}</div>
            )}
          </div>
        ))
      )}
    </>
  );
}
