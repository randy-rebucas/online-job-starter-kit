"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button className="btn subtle" onClick={() => signOut({ callbackUrl: "/login" })}>
      🚪 Sign out
    </button>
  );
}
