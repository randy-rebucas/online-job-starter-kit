import NextAuth from "next-auth";
import { fullAuthConfig } from "@/lib/auth";

export const { handlers, auth, signIn, signOut } = NextAuth(fullAuthConfig);
