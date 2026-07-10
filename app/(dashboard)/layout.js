import { ProgressProvider } from "@/components/ProgressContext";
import Shell from "@/components/Shell";

export default function DashboardLayout({ children }) {
  return (
    <ProgressProvider>
      <Shell>{children}</Shell>
    </ProgressProvider>
  );
}
