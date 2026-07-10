import { getContent } from "@/lib/content";
import RoadmapView from "./RoadmapView";

export default async function RoadmapPage() {
  const roadmap = (await getContent("ROADMAP")) || [];
  return <RoadmapView roadmap={roadmap} />;
}
