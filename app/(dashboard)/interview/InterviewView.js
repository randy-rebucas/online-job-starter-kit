"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/formStyles";

export default function InterviewView({ questions }) {
  const cats = useMemo(() => ["All", ...new Set(questions.map((q) => q[0]))], [questions]);
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return questions.filter((item) => {
      const matchesCat = catFilter === "All" || item[0] === catFilter;
      const matchesSearch = !q || item.join(" ").toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [questions, catFilter, search]);

  return (
    <>
      <h1 className="page-title">🎤 Interview Prep</h1>
      <p className="page-sub">
        {questions.length} questions across {cats.length - 1} categories.
      </p>
      <div className="field">
        <input
          id="interview-search"
          name="interviewSearch"
          type="search"
          autoComplete="off"
          aria-label="Search questions"
          className={inputClass}
          placeholder="Search questions..."
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
      {!filtered.length ? (
        <div className="empty-state">No questions match.</div>
      ) : (
        <div className="card">
          <table>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i}>
                  <td style={{ width: 110 }}>
                    <span className="badge">{item[0]}</span>
                  </td>
                  <td>{item[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          🌟 What Interviewers Want
        </div>
        <p style={{ fontSize: 13.5 }}>
          Specificity · Ownership (&quot;I did,&quot; not &quot;we did&quot;) · Self-awareness · Alignment to the
          role · Calm confidence.
        </p>
        <div className="section-title">📊 Self-Scoring Rubric</div>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="badge easy">5 Excellent</span>
              </td>
              <td>Specific example, clear result, reflection/learning included</td>
            </tr>
            <tr>
              <td>
                <span className="badge easy">4 Good</span>
              </td>
              <td>Specific example, clear result, no reflection</td>
            </tr>
            <tr>
              <td>
                <span className="badge medium">3 Average</span>
              </td>
              <td>General example, vague result</td>
            </tr>
            <tr>
              <td>
                <span className="badge hard">2 Weak</span>
              </td>
              <td>No real example, generic statement</td>
            </tr>
            <tr>
              <td>
                <span className="badge hard">1 Poor</span>
              </td>
              <td>Off-topic, defensive, or no answer given</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
