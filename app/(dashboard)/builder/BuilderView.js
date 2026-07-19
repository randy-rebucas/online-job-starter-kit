"use client";

import { useCallback, useEffect, useId, useState } from "react";
import {
  Download,
  Search,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  FileText,
  Mail,
  FileStack,
  Link as LinkIcon,
  Send,
  RefreshCw,
  Edit3,
  Sparkles,
} from "lucide-react";
import CopyButton from "@/components/CopyButton";
import Modal from "@/components/Modal";
import { inputClass, textareaClass, selectClass } from "@/components/formStyles";
import { PDF_INK, PDF_DIM, PDF_ACCENT, PDF_RULE } from "@/lib/pdfTheme";

function slugifyFilename(title) {
  return (
    (title || "document")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "document"
  );
}

/* ============================================================
   RESUME PDF — builds an actual CV PDF client-side from the same
   resume data the on-screen preview renders, via jsPDF.
   ============================================================ */
const PDF_MARGIN_X = 54;

async function buildResumePdf(v) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PDF_MARGIN_X * 2;
  const lineHeight = 14;
  let y = 56;

  function ensureSpace(extra = lineHeight) {
    if (y + extra > pageHeight - 50) {
      doc.addPage();
      y = 56;
    }
  }

  function paragraph(text, { size = 10.5, color = PDF_INK, style = "normal", gapAfter = 10 } = {}) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.splitTextToSize(text, contentWidth).forEach((line) => {
      ensureSpace();
      doc.text(line, PDF_MARGIN_X, y);
      y += lineHeight;
    });
    y += gapAfter;
  }

  function sectionTitle(title) {
    ensureSpace(26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...PDF_ACCENT);
    doc.text(title.toUpperCase(), PDF_MARGIN_X, y);
    y += 5;
    doc.setDrawColor(...PDF_RULE);
    doc.line(PDF_MARGIN_X, y, PDF_MARGIN_X + contentWidth, y);
    y += 14;
  }

  function bulletList(bullets) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...PDF_INK);
    bullets.forEach((b) => {
      const lines = doc.splitTextToSize(b, contentWidth - 14);
      lines.forEach((line, i) => {
        ensureSpace();
        doc.text(i === 0 ? `•  ${line}` : `   ${line}`, PDF_MARGIN_X, y);
        y += lineHeight;
      });
    });
    y += 6;
  }

  // Name + contact header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...PDF_INK);
  doc.text(v.name || "Your Name", PDF_MARGIN_X, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_DIM);
  doc.text(
    `${v.location || "City, Country"}   ·   ${v.contact || "Phone | Email | LinkedIn | Portfolio"}`,
    PDF_MARGIN_X,
    y
  );
  y += 22;

  sectionTitle("Summary");
  paragraph(v.summary || "Write a 2-3 sentence summary of your experience and value.");

  sectionTitle("Skills");
  paragraph(v.skills || "List your key skills, separated by commas.");

  sectionTitle("Experience");
  const experiences = (v.experiences || []).filter((e) => e.role || e.company || e.dates || e.bullets);
  if (experiences.length) {
    experiences.forEach((e) => {
      ensureSpace(18);
      const header = `${e.role || "Role"} — ${e.company || "Company"}`;
      const dates = e.dates || "Dates";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...PDF_INK);
      doc.text(header, PDF_MARGIN_X, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...PDF_DIM);
      doc.text(dates, PDF_MARGIN_X + contentWidth - doc.getTextWidth(dates), y);
      y += 15;

      const bullets = (e.bullets || "")
        .split("\n")
        .map((b) => b.trim().replace(/^-\s*/, ""))
        .filter(Boolean);
      if (bullets.length) bulletList(bullets);
      else y += 6;
    });
  } else {
    paragraph("Add an experience entry to see it here.");
  }

  sectionTitle("Education");
  paragraph(v.edu || "Degree, University, Year");

  sectionTitle("Certifications");
  paragraph(v.cert || "Certification name, Year");

  sectionTitle("References");
  paragraph("Available upon request.");

  return doc;
}

function ResumePdfButton({ v, className = "btn small subtle copy-btn" }) {
  const [generating, setGenerating] = useState(false);

  async function handleClick() {
    setGenerating(true);
    try {
      const doc = await buildResumePdf(v);
      doc.save(`${slugifyFilename(v.name ? `resume-${v.name}` : "resume")}.pdf`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button className={className} onClick={handleClick} disabled={generating} title="Download as a PDF resume">
      {generating ? (
        "Generating…"
      ) : (
        <>
          <Download size={16} /> Download PDF
        </>
      )}
    </button>
  );
}

/* ============================================================
   AI ASSISTANT — sends the current field text to /api/ai/improve
   and lets the user accept or discard the suggested rewrite.
   ============================================================ */
function AiImproveButton({ docType, text, onAccept }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: docType, text }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Couldn't improve this text right now.");
      else setSuggestion(data.suggestion);
    } catch {
      setError("Couldn't reach the AI assistant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn small subtle"
        style={{ marginTop: 6 }}
        onClick={handleClick}
        disabled={loading || !text?.trim()}
      >
        <Sparkles size={14} /> {loading ? "Improving…" : "Improve with AI"}
      </button>
      {error && <div className="auth-error" style={{ marginTop: 6 }}>{error}</div>}
      <Modal
        open={!!suggestion}
        onClose={() => setSuggestion(null)}
        title="Suggested rewrite"
        footer={
          <>
            <button className="btn small subtle" onClick={() => setSuggestion(null)}>
              Discard
            </button>
            <button
              className="btn small primary"
              onClick={() => {
                onAccept(suggestion);
                setSuggestion(null);
              }}
            >
              Accept
            </button>
          </>
        }
      >
        <p style={{ whiteSpace: "pre-wrap", fontSize: 13.5 }}>{suggestion}</p>
      </Modal>
    </>
  );
}

function Field({ label, value, onChange, placeholder, textarea, aiType }) {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          className={textareaClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          name={id}
          type="text"
          autoComplete="off"
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {aiType && <AiImproveButton docType={aiType} text={value} onAccept={onChange} />}
    </div>
  );
}

function Layout({ form, preview, previewNode, savedDocsPanel, title = "Document Preview", showPreviewDownload = false, downloadButton = null }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="grid cols-2">
      <div>
        {savedDocsPanel}
        <div className="card">{form}</div>
      </div>
      <div className="card" style={{ position: "sticky", top: 16, alignSelf: "start" }}>
        <div className="flex-between">
          <strong>Preview</strong>
          <div style={{ display: "flex", gap: 6 }}>
            {showPreviewDownload && (
              <>
                <button
                  className="btn small subtle copy-btn"
                  onClick={() => setModalOpen(true)}
                  title="Open a clean, full-size preview"
                >
                  <Search size={15} /> Preview
                </button>
                {downloadButton}
              </>
            )}
            <CopyButton text={preview} className="btn small primary copy-btn" />
          </div>
        </div>
        <div className="doc-preview" style={{ marginTop: 10 }}>
          {previewNode}
        </div>
      </div>

      {showPreviewDownload && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={title}
          footer={
            <>
              {downloadButton}
              <CopyButton text={preview} className="btn small primary copy-btn" />
            </>
          }
        >
          <div className="doc-preview">{previewNode}</div>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   DOCUMENT RENDERING — turns plain-text preview strings into a
   formatted, paper-like document instead of a raw monospace dump.
   The plain-text string (built separately) still powers the Copy
   button, so what you paste elsewhere stays clean plain text.
   ============================================================ */

// Generic renderer for paragraph-based documents (cover letters, cold
// emails, follow-ups, proposals): blank-line-separated blocks become
// paragraphs, "- " lines become bullet lists, and a leading "Subject:"
// line is styled as an email subject header.
function ProseDocument({ text }) {
  const blocks = text.split(/\n\s*\n/).filter((b) => b.trim());

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (i === 0 && /^subject:/i.test(lines[0] || "")) {
          return (
            <div className="doc-subject" key={i}>
              {lines[0]}
            </div>
          );
        }
        const isBulletList = lines.length > 0 && lines.every((l) => l.startsWith("-"));
        if (isBulletList) {
          return (
            <ul className="doc-bullets" key={i}>
              {lines.map((l, li) => (
                <li key={li}>{l.replace(/^-\s*/, "")}</li>
              ))}
            </ul>
          );
        }
        return (
          <p className="doc-p" key={i}>
            {lines.map((l, li) => (
              <span key={li}>
                {l}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

function ResumeDocument({ v }) {
  const hasExperience = (v.experiences || []).some((e) => e.role || e.company || e.dates || e.bullets);

  return (
    <>
      <div className="doc-name">{v.name || "Your Name"}</div>
      <div className="doc-contact">
        {v.location || "City, Country"} · {v.contact || "Phone | Email | LinkedIn | Portfolio"}
      </div>

      <div className="doc-section-title">Summary</div>
      <p className="doc-p">
        {v.summary || <span className="doc-empty-hint">Write a 2-3 sentence summary of your experience and value.</span>}
      </p>

      <div className="doc-section-title">Skills</div>
      <p className="doc-p">
        {v.skills || <span className="doc-empty-hint">List your key skills, separated by commas.</span>}
      </p>

      <div className="doc-section-title">Experience</div>
      {hasExperience ? (
        (v.experiences || [])
          .filter((e) => e.role || e.company || e.dates || e.bullets)
          .map((e, i) => {
            const bullets = (e.bullets || "")
              .split("\n")
              .map((b) => b.trim().replace(/^-\s*/, ""))
              .filter(Boolean);
            return (
              <div className="doc-exp-entry" key={i}>
                <div className="doc-exp-header">
                  {e.role || "Role"} — {e.company || "Company"}{" "}
                  <span className="doc-exp-dates">| {e.dates || "Dates"}</span>
                </div>
                {bullets.length > 0 && (
                  <ul className="doc-bullets">
                    {bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
      ) : (
        <p className="doc-p doc-empty-hint">Add an experience entry to see it here.</p>
      )}

      <div className="doc-section-title">Education</div>
      <p className="doc-p">{v.edu || <span className="doc-empty-hint">Degree, University, Year</span>}</p>

      <div className="doc-section-title">Certifications</div>
      <p className="doc-p">
        {v.cert || <span className="doc-empty-hint">Certification name, Year</span>}
      </p>

      <div className="doc-section-title">References</div>
      <p className="doc-p">Available upon request.</p>
    </>
  );
}

function LinkedInDocument({ v }) {
  return (
    <>
      <div className="doc-section-title" style={{ marginTop: 4 }}>
        Headline
      </div>
      <p className="doc-p">
        {v.headline || (
          <span className="doc-empty-hint">
            [Role/niche] helping [who you help] [do what] | [1-2 standout skills]
          </span>
        )}
      </p>
      <div className="doc-section-title">About</div>
      <p className="doc-p">
        I&apos;m a {v.role || "[your role/niche]"} who helps {v.audience || "[who you help]"} get real results — not
        just busywork.
      </p>
      <p className="doc-p">My focus areas: {v.skills || "[your key skills, comma-separated]"}.</p>
      <p className="doc-p">
        {v.result || "[A specific, numbers-backed result you've delivered for a client or employer]"}.
      </p>
      <p className="doc-p">
        {v.cta || "If that sounds like what you need, send me a message — I'd love to hear about your project."}
      </p>
    </>
  );
}

/* ============================================================
   SAVED DOCUMENTS PANEL — save/load/delete per document type
   ============================================================ */
function SavedDocsPanel({ type, getSnapshot, onLoad }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents?type=${type}`);
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    // Standard fetch-on-mount: syncing local state with the /api/documents
    // external source. refresh()'s leading setLoading(true) trips the
    // set-state-in-effect heuristic, but there's no prop/state derivation
    // here to move out of the effect — this is the pattern the rule exists to allow.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  async function handleSave() {
    if (!title.trim()) return;
    setBusy(true);
    setError("");
    const { data, content } = getSnapshot();
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title, data, content }),
    });
    const result = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(result.error || "Couldn't save.");
      return;
    }
    setTitle("");
    refresh();
  }

  async function handleDelete(id) {
    setBusy(true);
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setBusy(false);
    refresh();
  }

  return (
    <div className="card">
      <div className="section-title" style={{ marginTop: 0 }}>
        <Save size={16} /> Saved Versions
      </div>
      {error && <div className="auth-error">{error}</div>}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input
          className={inputClass}
          placeholder="Name this version (e.g. 'For VA roles')"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button className="btn small primary" disabled={!title.trim() || busy} onClick={handleSave}>
          Save
        </button>
      </div>
      {loading ? (
        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Loading…</div>
      ) : !docs.length ? (
        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>No saved versions yet.</div>
      ) : (
        docs.map((d) => (
          <div
            key={d.id}
            className="flex-between"
            style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}
          >
            <div>
              <strong style={{ fontSize: 13 }}>{d.title}</strong>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                {new Date(d.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn small subtle" disabled={busy} onClick={() => onLoad(d.data)}>
                Load
              </button>
              <button className="btn small danger" disabled={busy} onClick={() => handleDelete(d.id)}>
                <X size={14} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ============================================================
   RESUME BUILDER — repeatable, reorderable experience entries
   ============================================================ */
const emptyExperience = () => ({ role: "", company: "", dates: "", bullets: "" });

const resumeDefaults = () => ({
  name: "",
  location: "",
  contact: "",
  summary: "",
  skills: "",
  experiences: [emptyExperience()],
  edu: "",
  cert: "",
});

function buildResumePreview(v) {
  const expText = (v.experiences || [])
    .filter((e) => e.role || e.company || e.dates || e.bullets)
    .map((e) => {
      const header = `${e.role || "[Role]"} — ${e.company || "[Company]"} | ${e.dates || "[Dates]"}`;
      const bullets = (e.bullets || "")
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean)
        .map((b) => (b.startsWith("-") ? b : `- ${b}`))
        .join("\n");
      return bullets ? `${header}\n${bullets}` : header;
    })
    .join("\n\n");

  return `${v.name || "[FULL NAME]"}
${v.location || "[City, Country]"} | ${v.contact || "[Phone | Email | LinkedIn | Portfolio]"}

SUMMARY
${v.summary || "[Write a 2-3 sentence summary of your experience and value.]"}

SKILLS
${v.skills || "[List your key skills, separated by commas]"}

EXPERIENCE
${expText || "[Role — Company | Dates]\n- [Achievement with a number/result]"}

EDUCATION
${v.edu || "[Degree, University, Year]"}

CERTIFICATIONS
${v.cert || "[Certification name, Year]"}

REFERENCES
Available upon request.`;
}

function ResumeBuilder() {
  const [v, setV] = useState(resumeDefaults);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));

  function loadResume(data) {
    setV({
      ...resumeDefaults(),
      ...data,
      experiences: data?.experiences?.length ? data.experiences : [emptyExperience()],
    });
  }

  function updateExperience(i, field, val) {
    setV((p) => {
      const experiences = p.experiences.map((e, idx) => (idx === i ? { ...e, [field]: val } : e));
      return { ...p, experiences };
    });
  }
  function addExperience() {
    setV((p) => ({ ...p, experiences: [...p.experiences, emptyExperience()] }));
  }
  function removeExperience(i) {
    setV((p) => {
      const experiences = p.experiences.filter((_, idx) => idx !== i);
      return { ...p, experiences: experiences.length ? experiences : [emptyExperience()] };
    });
  }
  function moveExperience(i, dir) {
    setV((p) => {
      const experiences = [...p.experiences];
      const j = i + dir;
      if (j < 0 || j >= experiences.length) return p;
      [experiences[i], experiences[j]] = [experiences[j], experiences[i]];
      return { ...p, experiences };
    });
  }

  const preview = buildResumePreview(v);

  return (
    <Layout
      form={
        <>
          <div className="section-title" style={{ marginTop: 0 }}>
            Your Details
          </div>
          <Field label="Full Name" placeholder="Juan Dela Cruz" value={v.name} onChange={set("name")} />
          <Field label="City, Country" placeholder="Manila, Philippines" value={v.location} onChange={set("location")} />
          <Field
            label="Phone | Email | LinkedIn | Portfolio"
            placeholder="+63 900 000 0000 | juan@email.com | linkedin.com/in/juan | portfolio.com/juan"
            value={v.contact}
            onChange={set("contact")}
          />
          <Field
            label="Summary (2-3 sentences)"
            placeholder="Detail-oriented Virtual Assistant with 2+ years supporting entrepreneurs..."
            value={v.summary}
            onChange={set("summary")}
            textarea
            aiType="resume"
          />
          <Field
            label="Skills (comma-separated)"
            placeholder="Calendar Management, Email Management, Canva, Trello"
            value={v.skills}
            onChange={set("skills")}
          />

          <div className="flex-between" style={{ marginTop: 20 }}>
            <div className="section-title" style={{ margin: 0 }}>
              Experience
            </div>
            <button className="btn small subtle" onClick={addExperience}>
              + Add Entry
            </button>
          </div>
          {v.experiences.map((exp, i) => (
            <div
              key={i}
              className="card"
              style={{ background: "var(--bg)", padding: 14, marginBottom: 10 }}
            >
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: 12.5, color: "var(--text-dim)" }}>Entry {i + 1}</strong>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    className="btn small subtle"
                    disabled={i === 0}
                    onClick={() => moveExperience(i, -1)}
                    aria-label="Move entry up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    className="btn small subtle"
                    disabled={i === v.experiences.length - 1}
                    onClick={() => moveExperience(i, 1)}
                    aria-label="Move entry down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    className="btn small danger"
                    onClick={() => removeExperience(i)}
                    aria-label="Remove entry"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <Field
                label="Role"
                placeholder="Virtual Assistant"
                value={exp.role}
                onChange={(val) => updateExperience(i, "role", val)}
              />
              <Field
                label="Company"
                placeholder="Freelance"
                value={exp.company}
                onChange={(val) => updateExperience(i, "company", val)}
              />
              <Field
                label="Dates"
                placeholder="Jan 2024 - Present"
                value={exp.dates}
                onChange={(val) => updateExperience(i, "dates", val)}
              />
              <Field
                label="Bullets (one per line)"
                placeholder={"Managed inboxes for 3 clients\nCut response time by 40%"}
                value={exp.bullets}
                onChange={(val) => updateExperience(i, "bullets", val)}
                textarea
              />
            </div>
          ))}

          <Field
            label="Education"
            placeholder="Bachelor of Science in Business Administration, XYZ University, 2022"
            value={v.edu}
            onChange={set("edu")}
          />
          <Field
            label="Certifications (comma-separated)"
            placeholder="VA Certification 2024, Google Digital Marketing Certificate"
            value={v.cert}
            onChange={set("cert")}
          />
        </>
      }
      preview={preview}
      previewNode={<ResumeDocument v={v} />}
      title={`Resume — ${v.name || "Preview"}`}
      showPreviewDownload
      downloadButton={<ResumePdfButton v={v} />}
      savedDocsPanel={
        <SavedDocsPanel type="resume" getSnapshot={() => ({ data: v, content: preview })} onLoad={loadResume} />
      }
    />
  );
}

/* ============================================================
   COVER LETTER BUILDER
   ============================================================ */
const coverDefaults = () => ({ client: "", need: "", experience: "", different: "", cta: "", name: "", link: "" });
function buildCoverPreview(v) {
  return `Hi ${v.client || "[Client Name]"},

I noticed you're looking for ${v.need || "[specific need from job post]"}. I recently ${
    v.experience || "[relevant experience with a concrete result]"
  }.

${v.different || "[What makes you specifically a good fit]"}.

${v.cta || "[Clear call to action]"}

Best regards,
${v.name || "[Your Name]"}
${v.link || "[Portfolio/LinkedIn link]"}`;
}

function CoverBuilder() {
  const [v, setV] = useState(coverDefaults);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  const preview = buildCoverPreview(v);

  return (
    <Layout
      form={
        <>
          <div className="section-title" style={{ marginTop: 0 }}>
            Your Details
          </div>
          <Field label="Client/Hiring Manager Name" placeholder="Sarah" value={v.client} onChange={set("client")} />
          <Field
            label="Their specific need (from job post)"
            placeholder="a VA to manage inbox and calendar"
            value={v.need}
            onChange={set("need")}
          />
          <Field
            label="Your relevant experience + one result"
            placeholder="supported 3 coaches, cutting admin time by 10 hrs/week"
            value={v.experience}
            onChange={set("experience")}
            textarea
            aiType="cover"
          />
          <Field
            label="What makes you different"
            placeholder="I pick up new tools quickly and communicate proactively"
            value={v.different}
            onChange={set("different")}
          />
          <Field
            label="Call to action"
            placeholder="When's a good time this week for a quick call?"
            value={v.cta}
            onChange={set("cta")}
          />
          <Field label="Your Name" placeholder="Juan Dela Cruz" value={v.name} onChange={set("name")} />
          <Field
            label="Portfolio/LinkedIn link"
            placeholder="portfolio.com/juan"
            value={v.link}
            onChange={set("link")}
          />
        </>
      }
      preview={preview}
      previewNode={<ProseDocument text={preview} />}
      title={`Cover Letter — ${v.name || "Preview"}`}
      savedDocsPanel={
        <SavedDocsPanel
          type="cover"
          getSnapshot={() => ({ data: v, content: preview })}
          onLoad={(data) => setV({ ...coverDefaults(), ...data })}
        />
      }
    />
  );
}

/* ============================================================
   PROPOSAL BUILDER
   ============================================================ */
const proposalDefaults = () => ({
  name: "", client: "", need: "", skill: "", pastClient: "", result: "", experience: "",
  detail: "", targetAudience: "", step1: "", step2: "", step3: "", hours: "", timeframe: "",
});

function ProposalBuilder({ templates }) {
  const platforms = Object.keys(templates || {});
  const [platform, setPlatform] = useState(platforms[0]);
  const [version, setVersion] = useState("short");
  const [v, setV] = useState(proposalDefaults);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));

  if (!platforms.length) {
    return <div className="empty-state">Proposal templates aren&apos;t available right now.</div>;
  }

  const map = {
    name: v.name || "[Your Name]",
    client: v.client || "[Client Name]",
    need: v.need || "[specific need]",
    skill: v.skill || "[your skill/service]",
    pastClient: v.pastClient || "[past client/context]",
    result: v.result || "[specific result]",
    experience: v.experience || "[X years/projects]",
    detail: v.detail || "[specific detail from their post]",
    targetAudience: v.targetAudience || "[target audience]",
    step1: v.step1 || "[step 1]",
    step2: v.step2 || "[step 2]",
    step3: v.step3 || "[step 3]",
    hours: v.hours || "[X hours/week]",
    timeframe: v.timeframe || "[timeframe]",
    action: v.result || "[specific action taken]",
  };
  const activePlatform = platform && templates[platform] ? platform : platforms[0];
  const template = templates[activePlatform][version] || Object.values(templates[activePlatform])[0] || "";
  const preview = template.replace(/\{(\w+)\}/g, (m, key) => map[key] ?? m);

  function loadProposal(data) {
    const { platform: p, version: ver, ...rest } = data || {};
    setV({ ...proposalDefaults(), ...rest });
    if (p && platforms.includes(p)) setPlatform(p);
    if (ver) setVersion(ver);
  }

  return (
    <Layout
      form={
        <>
          <div className="section-title" style={{ marginTop: 0 }}>
            Proposal Details
          </div>
          <div className="field">
            <label className="field-label" htmlFor="proposal-platform">
              Platform
            </label>
            <select
              id="proposal-platform"
              name="platform"
              className={selectClass}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="proposal-version">
              Version
            </label>
            <select
              id="proposal-version"
              name="version"
              className={selectClass}
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            >
              <option value="short">Short</option>
              <option value="long">Long</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <Field label="Your Name" placeholder="Juan Dela Cruz" value={v.name} onChange={set("name")} />
          <Field label="Client Name" placeholder="Alex" value={v.client} onChange={set("client")} />
          <Field label="Their need / role" placeholder="a social media manager" value={v.need} onChange={set("need")} />
          <Field
            label="Your relevant skill/service"
            placeholder="content calendar systems"
            value={v.skill}
            onChange={set("skill")}
          />
          <Field
            label="Past client/context"
            placeholder="a skincare brand"
            value={v.pastClient}
            onChange={set("pastClient")}
          />
          <Field
            label="Result you achieved"
            placeholder="grew followers from 2K to 8K in 4 months"
            value={v.result}
            onChange={set("result")}
            aiType="proposal"
          />
          <Field label="Years/experience level" placeholder="3 years" value={v.experience} onChange={set("experience")} />
          <Field
            label="Specific detail you noticed about them"
            placeholder="your posting schedule looks inconsistent"
            value={v.detail}
            onChange={set("detail")}
          />
          <Field
            label="Who you typically help"
            placeholder="small business owners"
            value={v.targetAudience}
            onChange={set("targetAudience")}
          />
          <Field label="Process Step 1" placeholder="Audit current content and goals" value={v.step1} onChange={set("step1")} />
          <Field
            label="Process Step 2"
            placeholder="Build a 30-day content calendar"
            value={v.step2}
            onChange={set("step2")}
          />
          <Field label="Process Step 3" placeholder="Launch, track, and optimize" value={v.step3} onChange={set("step3")} />
          <Field label="Availability (hours/week)" placeholder="20 hrs/week" value={v.hours} onChange={set("hours")} />
          <Field
            label="Start timeframe / timezone"
            placeholder="immediately, GMT+8"
            value={v.timeframe}
            onChange={set("timeframe")}
          />
        </>
      }
      preview={preview}
      previewNode={<ProseDocument text={preview} />}
      title={`Proposal — ${platform}`}
      savedDocsPanel={
        <SavedDocsPanel
          type="proposal"
          getSnapshot={() => ({ data: { ...v, platform, version }, content: preview })}
          onLoad={loadProposal}
        />
      }
    />
  );
}

/* ============================================================
   LINKEDIN ABOUT BUILDER
   ============================================================ */
const linkedinDefaults = () => ({ headline: "", role: "", audience: "", skills: "", result: "", cta: "" });
function buildLinkedInPreview(v) {
  return `HEADLINE
${v.headline || "[Role/niche] helping [who you help] [do what] | [1-2 standout skills]"}

ABOUT
I'm a ${v.role || "[your role/niche]"} who helps ${v.audience || "[who you help]"} get real results — not just busywork.

My focus areas: ${v.skills || "[your key skills, comma-separated]"}.

${v.result || "[A specific, numbers-backed result you've delivered for a client or employer]"}.

${v.cta || "If that sounds like what you need, send me a message — I'd love to hear about your project."}`;
}

function LinkedInBuilder() {
  const [v, setV] = useState(linkedinDefaults);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  const preview = buildLinkedInPreview(v);

  return (
    <Layout
      form={
        <>
          <div className="section-title" style={{ marginTop: 0 }}>
            Your Details
          </div>
          <Field
            label="Headline (role + who you help + top skill)"
            placeholder="Virtual Assistant helping busy coaches reclaim 10+ hrs/week | Inbox & Calendar Systems"
            value={v.headline}
            onChange={set("headline")}
          />
          <Field label="Your role/niche" placeholder="Virtual Assistant" value={v.role} onChange={set("role")} />
          <Field
            label="Who you help"
            placeholder="online coaches and small business owners"
            value={v.audience}
            onChange={set("audience")}
          />
          <Field
            label="Key skills (comma-separated)"
            placeholder="Inbox Management, Calendar Systems, Client Onboarding, Notion"
            value={v.skills}
            onChange={set("skills")}
          />
          <Field
            label="A specific, numbers-backed result"
            placeholder="Cut a client's admin workload by 10 hours/week within the first month"
            value={v.result}
            onChange={set("result")}
            textarea
            aiType="linkedin"
          />
          <Field
            label="Call to action"
            placeholder="If that sounds like what you need, send me a message."
            value={v.cta}
            onChange={set("cta")}
            textarea
          />
        </>
      }
      preview={preview}
      previewNode={<LinkedInDocument v={v} />}
      title="LinkedIn About"
      savedDocsPanel={
        <SavedDocsPanel
          type="linkedin"
          getSnapshot={() => ({ data: v, content: preview })}
          onLoad={(data) => setV({ ...linkedinDefaults(), ...data })}
        />
      }
    />
  );
}

/* ============================================================
   COLD OUTREACH EMAIL BUILDER
   ============================================================ */
const coldEmailDefaults = () => ({ prospect: "", business: "", observation: "", service: "", result: "", cta: "", name: "" });
function buildColdEmailPreview(v) {
  return `Subject: Quick idea for ${v.business || "[Their Business Name]"}

Hi ${v.prospect || "[Prospect Name]"},

${v.observation || "[Something specific you noticed about their business — a post, a gap, a launch]"}.

I help businesses like yours with ${v.service || "[your service/value proposition]"}. ${
    v.result || "[A brief, specific result you've delivered for a similar client]"
  }.

${v.cta || "Would you be open to a quick 15-minute call this week to see if it's a fit?"}

Best,
${v.name || "[Your Name]"}`;
}

function ColdEmailBuilder() {
  const [v, setV] = useState(coldEmailDefaults);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  const preview = buildColdEmailPreview(v);

  return (
    <Layout
      form={
        <>
          <div className="section-title" style={{ marginTop: 0 }}>
            Outreach Details
          </div>
          <Field label="Prospect's Name" placeholder="Maria" value={v.prospect} onChange={set("prospect")} />
          <Field
            label="Their Business Name"
            placeholder="Bloom Skincare Co."
            value={v.business}
            onChange={set("business")}
          />
          <Field
            label="Specific observation about them"
            placeholder="I noticed your Instagram hasn't posted in a few weeks despite your product launch"
            value={v.observation}
            onChange={set("observation")}
            textarea
            aiType="coldemail"
          />
          <Field
            label="Your service/value proposition"
            placeholder="done-for-you content calendars and scheduling"
            value={v.service}
            onChange={set("service")}
          />
          <Field
            label="A brief, specific result for a similar client"
            placeholder="I helped a skincare brand grow from 2K to 8K followers in 4 months"
            value={v.result}
            onChange={set("result")}
            textarea
          />
          <Field
            label="Call to action"
            placeholder="Would you be open to a quick 15-minute call this week?"
            value={v.cta}
            onChange={set("cta")}
          />
          <Field label="Your Name" placeholder="Juan Dela Cruz" value={v.name} onChange={set("name")} />
        </>
      }
      preview={preview}
      previewNode={<ProseDocument text={preview} />}
      title={`Cold Outreach — ${v.business || "Preview"}`}
      savedDocsPanel={
        <SavedDocsPanel
          type="coldemail"
          getSnapshot={() => ({ data: v, content: preview })}
          onLoad={(data) => setV({ ...coldEmailDefaults(), ...data })}
        />
      }
    />
  );
}

/* ============================================================
   FOLLOW-UP EMAIL BUILDER
   ============================================================ */
const followUpDefaults = () => ({ name: "", context: "", addedValue: "", cta: "", sender: "" });
function buildFollowUpPreview(v) {
  return `Hi ${v.name || "[Name]"},

Just following up on ${v.context || "[what you sent or last discussed — a proposal, an application, a call]"} —
I know things get busy, so no worries if this slipped down the list.

${v.addedValue || "[A short new reason to reply — an added idea, a relevant update, or a fresh result]"}.

${v.cta || "Let me know if you have any questions, or if now still isn't the right time."}

Best,
${v.sender || "[Your Name]"}`;
}

function FollowUpBuilder() {
  const [v, setV] = useState(followUpDefaults);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  const preview = buildFollowUpPreview(v);

  return (
    <Layout
      form={
        <>
          <div className="section-title" style={{ marginTop: 0 }}>
            Follow-up Details
          </div>
          <Field label="Their Name" placeholder="Sarah" value={v.name} onChange={set("name")} />
          <Field
            label="What you're following up on"
            placeholder="the proposal I sent last Tuesday for the content calendar project"
            value={v.context}
            onChange={set("context")}
            textarea
          />
          <Field
            label="A short new reason to reply"
            placeholder="I put together a quick sample calendar based on your last post — happy to share it"
            value={v.addedValue}
            onChange={set("addedValue")}
            textarea
            aiType="followup"
          />
          <Field
            label="Call to action"
            placeholder="Let me know if you have any questions, or if now isn't the right time."
            value={v.cta}
            onChange={set("cta")}
          />
          <Field label="Your Name" placeholder="Juan Dela Cruz" value={v.sender} onChange={set("sender")} />
        </>
      }
      preview={preview}
      previewNode={<ProseDocument text={preview} />}
      title={`Follow-up — ${v.name || "Preview"}`}
      savedDocsPanel={
        <SavedDocsPanel
          type="followup"
          getSnapshot={() => ({ data: v, content: preview })}
          onLoad={(data) => setV({ ...followUpDefaults(), ...data })}
        />
      }
    />
  );
}

const TABS = [
  { id: "resume", label: "Resume", icon: FileText },
  { id: "cover", label: "Cover Letter", icon: Mail },
  { id: "proposal", label: "Proposal", icon: FileStack },
  { id: "linkedin", label: "LinkedIn About", icon: LinkIcon },
  { id: "coldemail", label: "Cold Outreach", icon: Send },
  { id: "followup", label: "Follow-up", icon: RefreshCw },
];

export default function BuilderView({ proposalTemplates }) {
  const [tab, setTab] = useState("resume");

  return (
    <>
      <h1 className="page-title">
        <Edit3 size={22} /> Document Builder
      </h1>
      <p className="page-sub">
        Fill in your details to generate a ready-to-use resume, cover letter, proposal, LinkedIn About section, cold
        outreach email, or follow-up email — then save multiple versions per document type.
      </p>
      <div className="tabs">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} className={`tab-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>
      {tab === "resume" && <ResumeBuilder key="resume" />}
      {tab === "cover" && <CoverBuilder key="cover" />}
      {tab === "proposal" && <ProposalBuilder key="proposal" templates={proposalTemplates} />}
      {tab === "linkedin" && <LinkedInBuilder key="linkedin" />}
      {tab === "coldemail" && <ColdEmailBuilder key="coldemail" />}
      {tab === "followup" && <FollowUpBuilder key="followup" />}
    </>
  );
}
