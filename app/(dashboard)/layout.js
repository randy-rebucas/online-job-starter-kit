import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { ProgressProvider } from "@/components/ProgressContext";
import Shell from "@/components/Shell";

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect("/login"); // defensive; proxy.js already covers this

  await dbConnect();
  const user = await User.findById(session.user.id).select("isPaid").lean();
  if (!user?.isPaid) redirect("/billing");

  return (
    <ProgressProvider>
      <Shell>{children}</Shell>
    </ProgressProvider>
  );
}
