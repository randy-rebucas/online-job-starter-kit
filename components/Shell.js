"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useProgress } from "./ProgressContext";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/guide", icon: "📖", label: "Guide" },
  { href: "/roadmap", icon: "🗓️", label: "30-Day Roadmap" },
  { href: "/challenge", icon: "🏆", label: "90-Day Challenge" },
  { href: "/prompts", icon: "🤖", label: "AI Prompt Pack" },
  { href: "/builder", icon: "📝", label: "Document Builder" },
  { href: "/jobboards", icon: "🌐", label: "Job Boards" },
  { href: "/interview", icon: "🎤", label: "Interview Prep" },
  { href: "/tools", icon: "🧰", label: "AI Tools Cheat Sheet" },
  { href: "/salary", icon: "💵", label: "Salary Guide" },
  { href: "/trackers", icon: "📊", label: "Trackers" },
];

export default function Shell({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { state, patch } = useProgress();

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    patch({ theme: next });
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">📘</span>
          <div>
            <div className="brand-title">Online Job Starter Kit</div>
            <div className="brand-sub">Your remote career command center</div>
          </div>
        </div>
        <div className="topbar-actions">
          {session?.user && <span className="topbar-user">{session.user.name}</span>}
          <button className="btn ghost" title="Toggle theme" onClick={toggleTheme}>
            🌓
          </button>
          <button className="btn ghost" onClick={() => signOut({ callbackUrl: "/login" })}>
            Sign out
          </button>
        </div>
      </header>

      <div className="body">
        <nav className="sidebar">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${pathname === item.href ? " active" : ""}`}
            >
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
