"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/formStyles";

function yesNoBadge(v) {
  const cls = /yes/i.test(v) ? "yes" : /no/i.test(v) ? "no" : "medium";
  return <span className={`badge ${cls}`}>{v}</span>;
}

export default function ToolsView({ tools }) {
  const cats = useMemo(() => ["All", ...new Set(tools.map((t) => t[0]))], [tools]);
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tools.filter((t) => {
      const matchesCat = catFilter === "All" || t[0] === catFilter;
      const matchesSearch = !q || t.join(" ").toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [tools, catFilter, search]);

  return (
    <>
      <h1 className="page-title">🧰 AI Tools Cheat Sheet</h1>
      <p className="page-sub">{tools.length}+ tools. Pick 1-2 per category and master them before adding more.</p>
      <div className="field">
        <input
          id="tools-search"
          name="toolsSearch"
          type="search"
          autoComplete="off"
          aria-label="Search tools"
          className={inputClass}
          placeholder="Search tools..."
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
            <div className="empty-state">No tools match.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Description</th>
                  <th>Pricing</th>
                  <th>Free Plan</th>
                  <th>Best Use</th>
                  <th>Site</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{t[1]}</strong>
                      <br />
                      <span className="badge">{t[0]}</span>
                    </td>
                    <td>{t[2]}</td>
                    <td>{t[3]}</td>
                    <td>{yesNoBadge(t[4])}</td>
                    <td>{t[5]}</td>
                    <td style={{ fontSize: 12, color: "var(--text-dim)" }}>{t[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
