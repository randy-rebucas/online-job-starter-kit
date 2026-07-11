"use client";

import Link from "next/link";
import { Rocket, Calendar, FileText, Bot, BookOpen, Hand } from "lucide-react";
import { useProgress } from "@/components/ProgressContext";

export default function HomeView({ chapters, promptCount, jobBoardCount }) {
  const { state, loading } = useProgress();

  const totalDays = 30;
  const doneDays = Object.values(state.roadmap).filter(Boolean).length;
  const roadmapPct = Math.round((doneDays / totalDays) * 100);

  let totalChecks = 0;
  let doneChecks = 0;
  chapters.forEach((ch) => {
    ch.checklist.forEach((_, i) => {
      totalChecks++;
      if (state.chapterChecks[`${ch.id}-${i}`]) doneChecks++;
    });
  });
  const checklistPct = totalChecks ? Math.round((doneChecks / totalChecks) * 100) : 0;

  if (loading) return null;

  return (
    <>
      <h1 className="page-title">
        Welcome back <Hand size={22} style={{ verticalAlign: "middle" }} />
      </h1>
      <p className="page-sub">Your Complete Roadmap from Zero Experience to a Thriving Remote Career</p>

      <div className="quote-hero">
        &quot;You don&apos;t need more experience to start. You need one client, one win, and the courage to begin.&quot;
      </div>

      <div className="grid cols-4">
        <div className="card stat">
          <div className="num">{doneDays}/30</div>
          <div className="label">Roadmap Days Done</div>
        </div>
        <div className="card stat">
          <div className="num">{checklistPct}%</div>
          <div className="label">Chapter Checklists</div>
        </div>
        <div className="card stat">
          <div className="num">{promptCount}</div>
          <div className="label">AI Prompts Available</div>
        </div>
        <div className="card stat">
          <div className="num">{jobBoardCount}</div>
          <div className="label">Job Boards Listed</div>
        </div>
      </div>

      <div className="card">
        <div className="flex-between">
          <strong>30-Day Roadmap Progress</strong>
          <span>{roadmapPct}%</span>
        </div>
        <div className="progress-bar" style={{ marginTop: 8 }}>
          <div style={{ width: `${roadmapPct}%` }} />
        </div>
      </div>

      <div className="section-title">
        <Rocket size={18} /> Quick Actions
      </div>
      <div className="grid cols-3">
        <Link href="/roadmap" className="card">
          <strong>
            <Calendar size={16} /> Continue Roadmap
          </strong>
          <p style={{ color: "var(--text-dim)", fontSize: 13 }}>
            Pick up where you left off in the 30-day plan.
          </p>
        </Link>
        <Link href="/builder" className="card">
          <strong>
            <FileText size={16} /> Build a Document
          </strong>
          <p style={{ color: "var(--text-dim)", fontSize: 13 }}>
            Generate a resume, cover letter, or proposal.
          </p>
        </Link>
        <Link href="/prompts" className="card">
          <strong>
            <Bot size={16} /> Browse AI Prompts
          </strong>
          <p style={{ color: "var(--text-dim)", fontSize: 13 }}>
            200+ ready-to-use prompts across 28 categories.
          </p>
        </Link>
      </div>

      <div className="section-title">
        <BookOpen size={18} /> Chapter Overview
      </div>
      <div className="grid cols-2">
        {chapters.map((ch) => {
          const done = ch.checklist.filter((_, i) => state.chapterChecks[`${ch.id}-${i}`]).length;
          return (
            <Link key={ch.id} href={`/guide?chapter=${ch.id}`} className="card">
              <div className="flex-between">
                <strong>
                  Ch {ch.id}. {ch.title}
                </strong>
                <span className="badge">
                  {done}/{ch.checklist.length}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
