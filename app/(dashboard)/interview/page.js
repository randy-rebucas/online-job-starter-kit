import { getContent } from "@/lib/content";
import InterviewView from "./InterviewView";

export default async function InterviewPage() {
  const questions = (await getContent("INTERVIEW_QUESTIONS")) || [];
  return <InterviewView questions={questions} />;
}
