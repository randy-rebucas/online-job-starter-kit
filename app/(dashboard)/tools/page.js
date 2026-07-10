import { getContent } from "@/lib/content";
import ToolsView from "./ToolsView";

export default async function ToolsPage() {
  const tools = (await getContent("AI_TOOLS")) || [];
  return <ToolsView tools={tools} />;
}
