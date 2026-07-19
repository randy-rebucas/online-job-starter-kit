"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ProgressContext = createContext(null);

const DEFAULT_STATE = {
  roadmap: {},
  challenge: { daily: {}, milestones: {} },
  chapterChecks: {},
  trackers: {},
  habits: {},
  streaks: { currentStreak: 0, longestStreak: 0, lastActiveDate: null },
  theme: null,
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// Bumps the daily streak whenever a patch adds a *new* completed item on a
// day that hasn't already been counted — checking in twice in one day (or
// unchecking something) never inflates the streak.
function nextStreaks(prevState, partial) {
  const addsNewCompletion = ["roadmap", "chapterChecks", "habits"].some((key) => {
    if (!(key in partial)) return false;
    const before = prevState[key] || {};
    const after = partial[key] || {};
    return Object.keys(after).some((k) => after[k] && !before[k]);
  });
  if ("challenge" in partial) {
    const beforeDaily = prevState.challenge?.daily || {};
    const afterDaily = partial.challenge?.daily || {};
    if (Object.keys(afterDaily).some((k) => afterDaily[k] && !beforeDaily[k])) return computeBump(prevState);
    const beforeMs = prevState.challenge?.milestones || {};
    const afterMs = partial.challenge?.milestones || {};
    if (Object.keys(afterMs).some((k) => afterMs[k] && !beforeMs[k])) return computeBump(prevState);
  }
  if (!addsNewCompletion) return prevState.streaks;
  return computeBump(prevState);

  function computeBump(state) {
    const streaks = state.streaks || DEFAULT_STATE.streaks;
    const today = todayKey();
    if (streaks.lastActiveDate === today) return streaks;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const currentStreak = streaks.lastActiveDate === yesterday ? (streaks.currentStreak || 0) + 1 : 1;
    return {
      currentStreak,
      longestStreak: Math.max(streaks.longestStreak || 0, currentStreak),
      lastActiveDate: today,
    };
  }
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/state")
      .then((res) => res.json())
      .then((data) => {
        setState({ ...DEFAULT_STATE, ...data });
        if (data.theme) document.documentElement.setAttribute("data-theme", data.theme);
      })
      .finally(() => setLoading(false));
  }, []);

  const patch = useCallback(async (partial) => {
    const streaks = nextStreaks(state, partial);
    const fullPartial = streaks === state.streaks ? partial : { ...partial, streaks };
    setState((prev) => ({ ...prev, ...fullPartial }));
    const res = await fetch("/api/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullPartial),
    });
    const data = await res.json();
    setState((prev) => ({ ...prev, ...data }));
  }, [state]);

  return (
    <ProgressContext.Provider value={{ state, patch, loading }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
