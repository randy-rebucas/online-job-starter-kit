"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button className="btn subtle" onClick={() => signOut({ callbackUrl: "/login" })}>
      <LogOut size={16} /> Sign out
    </button>
  );
}
