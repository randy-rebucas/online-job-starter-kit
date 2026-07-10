import { getAllContent } from "@/lib/content";
import HomeView from "./HomeView";

export default async function HomePage() {
  const data = await getAllContent(["CHAPTERS", "PROMPTS", "JOB_BOARDS"]);
  return (
    <HomeView
      chapters={data.CHAPTERS || []}
      promptCount={(data.PROMPTS || []).length}
      jobBoardCount={(data.JOB_BOARDS || []).length}
    />
  );
}
