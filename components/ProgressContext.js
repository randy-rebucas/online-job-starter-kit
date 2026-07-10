"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ProgressContext = createContext(null);

const DEFAULT_STATE = {
  roadmap: {},
  challenge: { daily: {}, milestones: {} },
  chapterChecks: {},
  trackers: {},
  habits: {},
  theme: null,
};

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
    setState((prev) => ({ ...prev, ...partial }));
    const res = await fetch("/api/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    const data = await res.json();
    setState((prev) => ({ ...prev, ...data }));
  }, []);

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
