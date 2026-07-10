import { Suspense } from "react";
import { getContent } from "@/lib/content";
import GuideView from "./GuideView";

export default async function GuidePage() {
  const chapters = (await getContent("CHAPTERS")) || [];
  return (
    <Suspense>
      <GuideView chapters={chapters} />
    </Suspense>
  );
}
