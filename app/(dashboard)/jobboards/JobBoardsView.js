"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/formStyles";

function difficultyBadge(d) {
  const cls = /easy/i.test(d) && !/hard/i.test(d) ? "easy" : /hard/i.test(d) ? "hard" : "medium";
  return <span className={`badge ${cls}`}>{d}</span>;
}
function yesNoBadge(v) {
  const cls = /yes/i.test(v) ? "yes" : /no/i.test(v) ? "no" : "medium";
  return <span className={`badge ${cls}`}>{v}</span>;
}

export default function JobBoardsView({ jobBoards }) {
  const cats = useMemo(() => ["All", ...new Set(jobBoards.map((j) => j[0]))], [jobBoards]);
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobBoards.filter((j) => {
      const matchesCat = catFilter === "All" || j[0] === catFilter;
      const matchesSearch = !q || j.join(" ").toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [jobBoards, catFilter, search]);

  return (
    <>
      <p className="page-sub">
        {jobBoards.length}+ platforms. Pick 2-3 matching your target role — don&apos;t spread too thin.
      </p>
      <div className="field">
        <input
          id="jobboard-search"
          name="jobboardSearch"
          type="search"
          autoComplete="off"
          aria-label="Search platforms"
          className={inputClass}
          placeholder="Search platforms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="chip-row">
        {cats.map((c) => (
          <span key={c} className={`chip${catFilter === c ? " active" : ""}`} onClick={() => setCatFilter(c)}>
            {c}
          </span>
        ))}
      </div>
      <div className="card">
        <div className="table-wrap">
          {!filtered.length ? (
            <div className="empty-state">No platforms match.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Description</th>
                  <th>Best Jobs</th>
                  <th>Difficulty</th>
                  <th>Payment</th>
                  <th>Beginner Friendly</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((j, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{j[1]}</strong>
                      <br />
                      <span className="badge">{j[0]}</span>
                    </td>
                    <td>{j[2]}</td>
                    <td>{j[3]}</td>
                    <td>{difficultyBadge(j[4])}</td>
                    <td>{j[5]}</td>
                    <td>{yesNoBadge(j[6])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="callout">
        ⚠️ <strong>Scam red flags:</strong> upfront payment requests, unusually high pay for little work, chat-only
        communication off-platform, requests for bank login details, poor grammar with urgent pressure tactics.
      </div>
    </>
  );
}
