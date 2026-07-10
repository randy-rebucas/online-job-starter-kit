"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProgress } from "@/components/ProgressContext";
import CopyButton from "@/components/CopyButton";

function renderBody(body) {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const html = escaped
    .replace(/\n\n/g, "<br><br>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/❌ (.+)/g, '<span style="color:#e5484d;">❌ $1</span>')
    .replace(/✅ (.+)/g, '<span style="color:var(--emerald);">✅ $1</span>');
  return { __html: html };
}

export default function GuideView({ chapters }) {
  const searchParams = useSearchParams();
  const chapterParam = parseInt(searchParams.get("chapter"), 10) || null;
  const [seenParam, setSeenParam] = useState(chapterParam);
  const [activeId, setActiveId] = useState(chapterParam || chapters[0]?.id || 1);
  const { state, patch, loading } = useProgress();

  // Sync activeId when the ?chapter= query param changes from outside (e.g. a link from Home),
  // without clobbering it on every render once the user clicks a chapter in the sidebar.
  if (chapterParam && chapterParam !== seenParam) {
    setSeenParam(chapterParam);
    setActiveId(chapterParam);
  }

  const ch = chapters.find((c) => c.id === activeId) || chapters[0];

  function toggleCheck(key, checked) {
    patch({ chapterChecks: { ...state.chapterChecks, [key]: checked } });
  }

  if (loading || !ch) return null;

  return (
    <>
      <h1 className="page-title">📖 Guide</h1>
      <p className="page-sub">The full Online Job Starter Kit, chapter by chapter.</p>
      <div className="grid" style={{ gridTemplateColumns: "240px 1fr", alignItems: "start" }}>
        <div className="card" style={{ padding: 10 }}>
          {chapters.map((c) => (
            <div
              key={c.id}
              className="nav-item"
              style={{
                justifyContent: "flex-start",
                cursor: "pointer",
                background: c.id === activeId ? "var(--coral)" : "",
                color: c.id === activeId ? "#fff" : "",
              }}
              onClick={() => setActiveId(c.id)}
            >
              {c.id}. {c.title}
            </div>
          ))}
        </div>
        <div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>
              Chapter {ch.id}: {ch.title}
            </h2>
            <div style={{ fontSize: 14, lineHeight: 1.7 }} dangerouslySetInnerHTML={renderBody(ch.body)} />
            <div className="callout">
              🤖 <strong>AI Prompt:</strong> &quot;{ch.aiPrompt}&quot;
              <div style={{ marginTop: 8 }}>
                <CopyButton text={ch.aiPrompt} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="section-title" style={{ marginTop: 0 }}>
              ✅ Chapter Checklist
            </div>
            {ch.checklist.map((item, i) => {
              const key = `${ch.id}-${i}`;
              const done = !!state.chapterChecks[key];
              return (
                <div className={`checklist-item${done ? " done" : ""}`} key={key}>
                  <input
                    id={`chapter-check-${key}`}
                    type="checkbox"
                    checked={done}
                    onChange={(e) => toggleCheck(key, e.target.checked)}
                  />
                  <label className="label-text" htmlFor={`chapter-check-${key}`}>
                    {item}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
