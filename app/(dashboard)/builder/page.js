import { getContent } from "@/lib/content";
import BuilderView from "./BuilderView";

export default async function BuilderPage() {
  const proposalTemplates = (await getContent("PROPOSAL_TEMPLATES")) || {};
  return <BuilderView proposalTemplates={proposalTemplates} />;
}
