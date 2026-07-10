import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // "/" is the public landing page, so it's excluded (the `|$` alternative
  // matches the empty remainder right after the leading slash). Static files
  // (anything with an extension, e.g. /images/*.png) are also excluded —
  // Next's built-in image optimizer fetches raw public assets internally,
  // and those requests must not get redirected to /login. "/download" is the
  // PayMongo purchase-success flow, which guests use without ever logging in.
  // Every other route still requires auth.
  matcher: ["/((?!api|login|register|download|_next/static|_next/image|favicon.ico|.*\\..*|$).*)"],
};
