import { getAllContent } from "@/lib/content";
import ChallengeView from "./ChallengeView";

export default async function ChallengePage() {
  const data = await getAllContent(["CHALLENGE_DAILY", "CHALLENGE_MONTHS", "CHALLENGE_FINAL_QUESTIONS"]);
  return (
    <ChallengeView
      daily={data.CHALLENGE_DAILY || []}
      months={data.CHALLENGE_MONTHS || []}
      finalQuestions={data.CHALLENGE_FINAL_QUESTIONS || []}
    />
  );
}
