"use client";

import Link from "next/link";
import { Rocket, Calendar, FileText, Bot, BookOpen, Hand, Flame, Award, Users } from "lucide-react";
import { useProgress } from "@/components/ProgressContext";
import { computeBadges } from "@/lib/badges";

const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/1540342570926998";

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
  const badges = computeBadges(state, chapters);
  const streak = state.streaks || {};

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

      <div className="card">
        <div className="flex-between">
          <strong>
            <Flame size={16} style={{ verticalAlign: "middle", color: "var(--coral)" }} /> Daily Streak
          </strong>
          <span>{streak.currentStreak || 0} day{(streak.currentStreak || 0) === 1 ? "" : "s"} · best {streak.longestStreak || 0}</span>
        </div>
        <div className="section-title" style={{ marginTop: 14 }}>
          <Award size={16} /> Badges
        </div>
        <div className="grid cols-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className="badge"
              style={{
                textAlign: "center",
                padding: "10px 6px",
                opacity: b.earned ? 1 : 0.4,
                background: b.earned ? "var(--coral)" : "var(--bg)",
                color: b.earned ? "#fff" : "var(--text-dim)",
              }}
            >
              {b.label}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex-between">
          <strong>
            <Users size={16} style={{ verticalAlign: "middle", color: "var(--coral)" }} /> Join the Community
          </strong>
        </div>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 6 }}>
          Connect with other members, ask questions, and share wins in our Facebook group.
        </p>
        <a
          href={FACEBOOK_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary"
          style={{ marginTop: 4, display: "inline-flex" }}
        >
          <Users size={16} /> Like &amp; Join the Facebook Group
        </a>
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
