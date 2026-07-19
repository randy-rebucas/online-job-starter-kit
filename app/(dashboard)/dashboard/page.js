import { getAllContent } from "@/lib/content";
import HomeView from "./HomeView";

export default async function HomePage() {
  const data = await getAllContent(["CHAPTERS", "PROMPTS", "JOB_BOARDS", "ROADMAP"]);
  return (
    <HomeView
      chapters={data.CHAPTERS || []}
      prompts={data.PROMPTS || []}
      jobBoardCount={(data.JOB_BOARDS || []).length}
      roadmap={data.ROADMAP || []}
    />
  );
}
