"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { inputClass } from "@/components/formStyles";

export default function PromptsView({ prompts, categories }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return prompts.filter((p) => {
      const matchesCat = filter === "All" || p[0] === filter;
      const matchesSearch = !q || p.join(" ").toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [prompts, filter, search]);

  return (
    <>
      <h1 className="page-title">🤖 AI Prompt Pack</h1>
      <p className="page-sub">
        {prompts.length} ready-to-use prompts across {categories.length} categories. Replace [brackets] with your
        real details.
      </p>
      <div className="field">
        <input
          id="prompt-search"
          name="promptSearch"
          type="search"
          autoComplete="off"
          aria-label="Search prompts, goals, or tips"
          className={inputClass}
          placeholder="Search prompts, goals, or tips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="chip-row">
        <span className={`chip${filter === "All" ? " active" : ""}`} onClick={() => setFilter("All")}>
          All
        </span>
        {categories.map((c) => (
          <span key={c} className={`chip${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>
            {c}
          </span>
        ))}
      </div>
      {!filtered.length ? (
        <div className="empty-state">No prompts match your search.</div>
      ) : (
        filtered.map((p, i) => (
          <div className="prompt-card" key={i}>
            <div className="flex-between">
              <div className="goal">
                {p[1]} <span className="badge">{p[0]}</span>
              </div>
              <CopyButton text={p[2]} />
            </div>
            <div className="prompt-text">&quot;{p[2]}&quot;</div>
            <div className="meta-row">
              <strong>Expected output:</strong> {p[3]}
            </div>
            <div className="tip">💡 {p[4]}</div>
          </div>
        ))
      )}
    </>
  );
}
