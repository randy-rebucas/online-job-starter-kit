"use client";

import { useEffect } from "react";

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

// Renders nothing — just captures ?ref= on first touch so it survives the
// visitor navigating around before they actually register. Safe to mount on
// any page a referral link might land on.
export default function ReferralCapture() {
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref && !getCookie("ref_code")) {
      document.cookie = `ref_code=${encodeURIComponent(ref)}; max-age=${30 * 24 * 60 * 60}; path=/`;
    }
  }, []);

  return null;
}
