"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Home,
  BookOpen,
  Calendar,
  Trophy,
  Bot,
  FileText,
  Globe,
  Mic,
  Wrench,
  DollarSign,
  BarChart3,
  User,
  BookMarked,
  Download,
  Users,
  MessageSquarePlus,
  SunMoon,
  LogOut,
  ChevronUp,
  ChevronDown,
  Bell,
  Gift,
} from "lucide-react";
import { useProgress } from "./ProgressContext";

const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/1540342570926998";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/guide", icon: BookOpen, label: "Guide" },
  { href: "/roadmap", icon: Calendar, label: "30-Day Roadmap" },
  { href: "/challenge", icon: Trophy, label: "90-Day Challenge" },
  { href: "/prompts", icon: Bot, label: "AI Prompt Pack" },
  { href: "/builder", icon: FileText, label: "Document Builder" },
  { href: "/jobboards", icon: Globe, label: "Job Boards" },
  { href: "/interview", icon: Mic, label: "Interview Prep" },
  { href: "/tools", icon: Wrench, label: "AI Tools Cheat Sheet" },
  { href: "/salary", icon: DollarSign, label: "Salary Guide" },
  { href: "/trackers", icon: BarChart3, label: "Trackers" },
  { href: "/referrals", icon: Gift, label: "Referral Program" },
];

function AnnouncementsBell() {
  const { state, patch } = useProgress();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const lastSeen = state.lastSeenAnnouncementsAt ? new Date(state.lastSeenAnnouncementsAt).getTime() : 0;
  const unreadCount = announcements.filter((a) => new Date(a.createdAt).getTime() > lastSeen).length;

  const toggleOpen = useCallback(() => {
    setOpen((v) => {
      const next = !v;
      if (next && unreadCount > 0) patch({ lastSeenAnnouncementsAt: new Date().toISOString() });
      return next;
    });
  }, [unreadCount, patch]);

  return (
    <div className="user-menu" ref={ref}>
      <button className="btn ghost announcements-trigger" title="Announcements" onClick={toggleOpen}>
        <Bell size={18} />
        {unreadCount > 0 && <span className="announcements-badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="user-menu-dropdown announcements-dropdown">
          <div className="announcements-header">Announcements</div>
          {loading ? (
            <div className="announcements-empty">Loading…</div>
          ) : !announcements.length ? (
            <div className="announcements-empty">No announcements yet.</div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="announcement-item">
                <strong>{a.title}</strong>
                <p>{a.body}</p>
                <span className="announcement-date">{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Shell({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { state, patch } = useProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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
          <span className="brand-mark"><BookMarked size={20} /></span>
          <div>
            <div className="brand-title">Online Job Starter Kit</div>
            <div className="brand-sub">Your remote career command center</div>
          </div>
        </div>
        <div className="topbar-actions">
          <AnnouncementsBell />
          <button className="btn ghost" title="Toggle theme" onClick={toggleTheme}>
            <SunMoon size={18} />
          </button>
          {session?.user && (
            <div className="user-menu" ref={menuRef}>
              <button className="user-menu-trigger" onClick={() => setMenuOpen((v) => !v)}>
                <span className="topbar-user">{session.user.name}</span>
                <span aria-hidden="true">{menuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              </button>
              {menuOpen && (
                <div className="user-menu-dropdown">
                  <Link href="/profile" className="user-menu-item" onClick={() => setMenuOpen(false)}>
                    <User size={16} /> Profile
                  </Link>
                  <button
                    className="user-menu-item"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="body">
        <nav className="sidebar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${pathname === item.href ? " active" : ""}`}
              >
                <Icon size={18} /> <span>{item.label}</span>
              </Link>
            );
          })}
          <a href="/api/download/ebook" className="card sidebar-ebook" download>
            <Image
              src="/images/online-kit.png"
              alt="Online Job Starter Kit ebook cover"
              width={1536}
              height={1024}
              sizes="200px"
              className="sidebar-ebook-thumb"
            />
            <span className="sidebar-ebook-label">
              <Download size={16} className="sidebar-ebook-icon" />
              <span>Download Ebook</span>
            </span>
          </a>
          <div className="sidebar-footer">
            <a
              href={FACEBOOK_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item sidebar-footer-item"
            >
              <Users size={18} /> <span>Facebook Community</span>
            </a>
            <Link
              href="/suggest"
              className={`nav-item sidebar-footer-item${pathname === "/suggest" ? " active" : ""}`}
            >
              <MessageSquarePlus size={18} /> <span>Suggest a Feature</span>
            </Link>
          </div>
        </nav>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
