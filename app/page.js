import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Bot,
  FileText,
  Globe,
  BarChart3,
  BookMarked,
  Rocket,
  Zap,
  Package,
  Wrench,
  HelpCircle,
} from "lucide-react";
import { auth } from "@/auth";
import BuyKitButton from "./BuyKitButton";
import ImagePreview from "@/components/ImagePreview";
import Reveal from "@/components/Reveal";

const STARTER_KIT_PRICE_PHP = Number(process.env.STARTER_KIT_PRICE_PHP || 499);

const DOWNLOAD_HIGHLIGHTS = [
  "Resume & Cover Letter templates",
  "AI Prompt Pack for job search & career growth",
  "Portfolio Guide — build a portfolio that gets you hired",
  "50+ trusted job websites, worldwide",
  "30-Day step-by-step action plan",
  "Interview questions with sample answers",
  "AI Tools cheat sheet",
];

const FEATURES = [
  { icon: BookOpen, title: "Guide", desc: "8 in-depth chapters covering resumes, portfolios, and landing your first client." },
  { icon: Calendar, title: "30-Day Roadmap", desc: "A day-by-day action plan from zero experience to your first paid gig." },
  { icon: Bot, title: "AI Prompt Pack", desc: "200+ ready-to-use prompts across 28 categories, searchable and copy-ready." },
  { icon: FileText, title: "Document Builder", desc: "Generate a resume, cover letter, proposal, and more — save multiple versions, export to PDF." },
  { icon: Globe, title: "Live Job Boards", desc: "Real, current postings pulled from public job APIs, plus a directory of 50+ platforms." },
  { icon: BarChart3, title: "Trackers & Analytics", desc: "Track applications, interviews, and income — with an outcomes breakdown, not just spreadsheets." },
];

const STEPS = [
  {
    num: "1",
    title: "Create your free account",
    desc: "Sign up in seconds — no credit card, no trial that expires. Everything in the kit is unlocked immediately.",
  },
  {
    num: "2",
    title: "Follow the 30-day roadmap",
    desc: "Work through the guide, build your resume and portfolio, and check off daily tasks at your own pace.",
  },
  {
    num: "3",
    title: "Apply, track, and land your first client",
    desc: "Use the live job boards and AI-tailored documents to apply, then track outcomes until you get hired.",
  },
];

const FAQS = [
  {
    q: "Is it a subscription?",
    a: "No — it's a one-time payment for lifetime access. Pay once and every feature — the guide, roadmap, prompt pack, document builder, live job boards, and trackers — is yours forever, with no recurring fees.",
  },
  {
    q: "Do I need prior experience?",
    a: "No. The 30-day roadmap and guide are written for people starting with zero remote-work experience, and walk you through building proof (a portfolio, a resume) from scratch.",
  },
  {
    q: "Where do the job postings come from?",
    a: "The Job Boards page pulls real, current postings live from public job APIs (Remotive, Remote OK, Arbeitnow), refreshed every 15 minutes — plus a directory of 50+ platforms to apply through directly.",
  },
  {
    q: "Can I export what I build?",
    a: "Yes. The Document Builder saves multiple versions of your resume, cover letters, and proposals, and can export your resume as an actual PDF.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Card, GCash, and Maya, processed securely through PayMongo — you never enter payment details on our site, only on PayMongo's own hosted checkout page.",
  },
  {
    q: "Do you offer discounts?",
    a: "Yes — enter a discount code at checkout under \"Have a discount code?\" and the reduced price is applied before you're taken to payment.",
  },
  {
    q: "What happens right after I pay?",
    a: "You're redirected straight to a confirmation page that verifies your payment and gives you an immediate PDF download link. If you ever lose that link, just reach out and we'll help you recover it.",
  },
];

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="landing">
      <header className="landing-topbar">
        <div className="brand">
          <span className="brand-mark"><BookMarked size={20} /></span>
          <div>
            <div className="brand-title">Online Job Starter Kit</div>
            <div className="brand-sub">Your remote career command center</div>
          </div>
        </div>
        {session?.user ? (
          <Link href="/dashboard" className="btn primary">
            Go to Dashboard
          </Link>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/login" className="btn subtle">
              Sign In
            </Link>
            <Link href="/register" className="btn primary">
              Get Started
            </Link>
          </div>
        )}
      </header>

      <section className="landing-hero">
        <span className="landing-eyebrow"><Rocket size={16} /> Free to start — no credit card</span>
        <h1>From zero experience to a thriving remote career.</h1>
        <p>
          Everything you need in one place: a step-by-step roadmap, an AI prompt library, a document builder that
          saves and exports real files, live job postings, and progress tracking that actually shows results.
        </p>
        <div className="landing-hero-ctas">
          <Link href={session?.user ? "/dashboard" : "/register"} className="btn primary">
            {session?.user ? "Go to Dashboard" : "Start Free"}
          </Link>
          <Link href="/login" className="btn ghost">
            Sign In
          </Link>
        </div>
        <div className="landing-stats">
          <span>200+ AI Prompts</span>
          <span aria-hidden="true">·</span>
          <span>50+ Job Boards</span>
          <span aria-hidden="true">·</span>
          <span>30-Day Roadmap</span>
        </div>
        <p className="landing-quote">
          &quot;You don&apos;t need more experience to start. You need one client, one win, and the courage to
          begin.&quot;
        </p>
      </section>

      <section className="landing-steps">
        <Reveal>
          <div className="landing-section-head">
            <h2 className="section-title" style={{ marginTop: 0, justifyContent: "center" }}>
              <Zap size={20} /> How It Works
            </h2>
            <p>Three steps from signing up to landing your first client.</p>
          </div>
        </Reveal>
        <div className="grid cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 120}>
              <div className="card landing-step">
                <div className="landing-step-num">{s.num}</div>
                <strong>{s.title}</strong>
                <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 6 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="landing-download">
        <Reveal>
          <div className="grid cols-2 landing-download-grid">
            <div>
              <div className="section-title" style={{ marginTop: 0 }}>
                <Package size={18} /> Get the Complete Starter Kit
              </div>
              <h2 className="landing-download-title">Everything in one download.</h2>
              <p style={{ color: "var(--text-dim)", fontSize: 14.5, lineHeight: 1.6, marginBottom: 18 }}>
                The full 8-in-1 kit as a PDF you can keep, print, and reference offline — a one-time purchase, plus
                everything unlocked live in your free dashboard the moment you sign up.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {DOWNLOAD_HIGHLIGHTS.map((item) => (
                  <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 13.5 }}>
                    <span style={{ color: "var(--emerald)" }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <BuyKitButton priceLabel={`₱${STARTER_KIT_PRICE_PHP}`} />
            </div>
            <div className="landing-download-image">
              <ImagePreview
                src="/images/online-kit.png"
                alt="Online Job Starter Kit — 8-in-1 complete career kit: resume & cover letter templates, AI prompt pack, 30-day roadmap, 50+ job websites, interview questions, and AI tools cheat sheet"
                width={1536}
                height={1024}
                sizes="(max-width: 900px) 100vw, 540px"
                imgStyle={{ width: "100%", height: "auto", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="landing-features">
        <Reveal>
          <div className="landing-section-head">
            <h2 className="section-title" style={{ marginTop: 0, justifyContent: "center" }}>
              <Wrench size={20} /> Everything You Need
            </h2>
            <p>One account, six tools — no juggling spreadsheets, docs, and a dozen tabs.</p>
          </div>
        </Reveal>
        <div className="grid cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 90}>
                <div className="card">
                  <div style={{ marginBottom: 8 }}>
                    <Icon size={26} />
                  </div>
                  <strong>{f.title}</strong>
                  <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 6 }}>{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="landing-faq">
        <Reveal>
          <h2 className="section-title" style={{ marginTop: 0 }}>
            <HelpCircle size={20} /> Frequently Asked Questions
          </h2>
        </Reveal>
        {FAQS.map((item, i) => (
          <Reveal key={item.q} delay={i * 80}>
            <details className="landing-faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          </Reveal>
        ))}
      </section>

      <footer className="landing-footer">
        <Reveal>
          <h2 className="landing-footer-title">Ready to start your remote career?</h2>
          <Link href={session?.user ? "/dashboard" : "/register"} className="btn primary">
            {session?.user ? "Go to Dashboard" : "Create your free account"}
          </Link>
        </Reveal>
      </footer>

      <Reveal>
        <div className="landing-bottombar">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <BookMarked size={16} /> Online Job Starter Kit
          </span>
          <span>&copy; {new Date().getFullYear()}. Built for people starting from zero.</span>
        </div>
      </Reveal>
    </div>
  );
}
