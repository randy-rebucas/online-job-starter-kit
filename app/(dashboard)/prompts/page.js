import { getAllContent } from "@/lib/content";
import PromptsView from "./PromptsView";

export default async function PromptsPage() {
  const data = await getAllContent(["PROMPTS", "PROMPT_CATEGORIES"]);
  return <PromptsView prompts={data.PROMPTS || []} categories={data.PROMPT_CATEGORIES || []} />;
}
