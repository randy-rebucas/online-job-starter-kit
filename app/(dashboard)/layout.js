import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { ProgressProvider } from "@/components/ProgressContext";
import { MessagesProvider } from "@/components/MessagesContext";
import Shell from "@/components/Shell";

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect("/login"); // defensive; proxy.js already covers this

  await dbConnect();
  const user = await User.findById(session.user.id).select("isPaid").lean();
  // A resolved user id with no matching document means the session's JWT is
  // stale (e.g. account recreated/reseeded) — send back to login for a fresh
  // token instead of silently treating it as "hasn't paid".
  if (!user) redirect("/login");
  if (!user.isPaid) redirect("/billing");

  return (
    <ProgressProvider>
      <MessagesProvider>
        <Shell>{children}</Shell>
      </MessagesProvider>
    </ProgressProvider>
  );
}
