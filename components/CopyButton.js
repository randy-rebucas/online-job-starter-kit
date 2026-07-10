"use client";

import { useState } from "react";

export default function CopyButton({ text, className = "btn small subtle copy-btn" }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <button className={className} onClick={handleCopy}>
      {copied ? "✅ Copied" : "📋 Copy"}
    </button>
  );
}
