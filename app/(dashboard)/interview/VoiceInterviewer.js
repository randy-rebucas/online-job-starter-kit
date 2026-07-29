"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, Volume2, RefreshCw, Sparkles, Undo2 } from "lucide-react";
import { selectClass } from "@/components/formStyles";

function pickQuestion(pool, exclude) {
  const candidates = pool.filter((q) => q[1] !== exclude);
  const source = candidates.length ? candidates : pool;
  return source[Math.floor(Math.random() * source.length)];
}

// Web Speech API (SpeechRecognition + speechSynthesis) is built into the
// browser — Chrome/Edge support it fully, so this needs no external speech
// service or API key beyond the existing Anthropic key used for feedback.
function hasSpeechSupport() {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition) && !!window.speechSynthesis;
}

export default function VoiceInterviewer({ questions }) {
  const [supported] = useState(hasSpeechSupport);
  const cats = useMemo(() => ["All", ...new Set(questions.map((q) => q[0]))], [questions]);
  const [catFilter, setCatFilter] = useState("All");
  const pool = useMemo(
    () => (catFilter === "All" ? questions : questions.filter((q) => q[0] === catFilter)),
    [questions, catFilter]
  );
  const [question, setQuestion] = useState(() => pickQuestion(questions));
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!supported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = 0; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript;
      }
      setTranscript(finalText);
    };
    recognition.onerror = () => setError("Couldn't access the microphone. Check your browser permissions.");
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    return () => recognition.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only wire up recognition once
  }, []);

  function speakQuestion(q) {
    if (!q || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(q[1]);
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }

  // Auto-reads each question the moment it's shown, so practicing feels like
  // a live interviewer talking rather than a page you have to click through.
  useEffect(() => {
    if (!supported || !question) return;
    speakQuestion(question);
    return () => window.speechSynthesis?.cancel();
  }, [question, supported]);

  function startListening() {
    setFeedback(null);
    setError("");
    setTranscript("");
    recognitionRef.current?.start();
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function resetAnswer() {
    recognitionRef.current?.stop();
    setListening(false);
    setTranscript("");
    setFeedback(null);
    setError("");
  }

  function resetForNewQuestion() {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
    setListening(false);
    setTranscript("");
    setFeedback(null);
    setError("");
  }

  function nextQuestion() {
    resetForNewQuestion();
    setQuestion((prev) => pickQuestion(pool, prev?.[1]));
  }

  function changeCategory(cat) {
    setCatFilter(cat);
    resetForNewQuestion();
    const nextPool = cat === "All" ? questions : questions.filter((q) => q[0] === cat);
    setQuestion(pickQuestion(nextPool));
  }

  function selectQuestion(q) {
    resetForNewQuestion();
    setQuestion(q);
  }

  async function getFeedback() {
    if (!transcript.trim()) {
      setError("No answer was captured yet — try recording again.");
      return;
    }
    setLoadingFeedback(true);
    setError("");
    try {
      const res = await fetch("/api/ai/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question?.[1] || "", answer: transcript }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setFeedback(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoadingFeedback(false);
    }
  }

  if (!supported) {
    return (
      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          <Mic size={18} /> Voice Mock Interview
        </div>
        <p style={{ fontSize: 13.5, color: "var(--text-dim)" }}>
          Voice practice needs microphone and speech support in your browser — try this in Chrome or Edge on
          desktop.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex-between" style={{ flexWrap: "wrap", gap: 8 }}>
        <div className="section-title" style={{ marginTop: 0 }}>
          <Mic size={18} /> Voice Mock Interview
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn small subtle" onClick={() => speakQuestion(question)}>
            <Volume2 size={14} /> Replay Question
          </button>
          <button className="btn small subtle" onClick={nextQuestion}>
            <RefreshCw size={14} /> New Question
          </button>
        </div>
      </div>

      <div className="grid cols-2" style={{ marginTop: 4, marginBottom: 16, alignItems: "start" }}>
        <select
          aria-label="Filter by category"
          className={selectClass}
          value={catFilter}
          onChange={(e) => changeCategory(e.target.value)}
        >
          {cats.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          aria-label="Choose a specific question"
          className={selectClass}
          value={question ? question[1] : ""}
          onChange={(e) => selectQuestion(pool.find((q) => q[1] === e.target.value))}
        >
          {pool.map((q) => (
            <option key={q[1]} value={q[1]}>{q[1]}</option>
          ))}
        </select>
      </div>

      {question && (
        <div className="card" style={{ background: "var(--bg)" }}>
          <span className="badge">{question[0]}</span>
          <p style={{ fontSize: 14.5, fontWeight: 600, marginTop: 8 }}>{question[1]}</p>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {!listening ? (
          <button className="btn primary" onClick={startListening}>
            <Mic size={16} /> Start Answering
          </button>
        ) : (
          <button className="btn danger" onClick={stopListening}>
            <Square size={16} /> Stop Recording
          </button>
        )}
      </div>

      {(transcript || listening) && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="flex-between">
            <strong style={{ fontSize: 12.5, color: "var(--text-dim)" }}>
              {listening ? "Listening…" : "Your answer (transcribed):"}
            </strong>
            {!listening && transcript && (
              <button className="btn small subtle" onClick={resetAnswer}>
                <Undo2 size={14} /> Reset Answer
              </button>
            )}
          </div>
          <p style={{ fontSize: 13.5, marginTop: 6 }}>{transcript || "…"}</p>
        </div>
      )}

      {transcript && !listening && !feedback && (
        <button className="btn primary" style={{ marginTop: 12 }} onClick={getFeedback} disabled={loadingFeedback}>
          <Sparkles size={16} /> {loadingFeedback ? "Scoring your answer…" : "Get AI Feedback"}
        </button>
      )}

      {error && <p style={{ color: "#e5484d", fontSize: 13, marginTop: 10 }}>{error}</p>}

      {feedback && (
        <div className="card" style={{ marginTop: 12, borderColor: "var(--coral)" }}>
          <div className="flex-between">
            <strong>AI Feedback</strong>
            <span className="badge" style={{ background: "var(--coral)", color: "#fff" }}>
              {feedback.score}/5
            </span>
          </div>
          <p style={{ fontSize: 13.5, marginTop: 8 }}>
            <strong>Strengths:</strong> {feedback.strengths}
          </p>
          <p style={{ fontSize: 13.5, marginTop: 6 }}>
            <strong>Improve:</strong> {feedback.improve}
          </p>
        </div>
      )}
    </div>
  );
}
