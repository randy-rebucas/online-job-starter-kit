import { getContent } from "@/lib/content";
import { getLiveJobs } from "@/lib/jobFeeds";
import LiveJobsView from "./LiveJobsView";
import JobBoardsView from "./JobBoardsView";

export default async function JobBoardsPage() {
  const [jobBoards, live] = await Promise.all([
    getContent("JOB_BOARDS").then((v) => v || []),
    getLiveJobs(),
  ]);

  return (
    <>
      <h1 className="page-title">🌐 Job Boards</h1>
      <p className="page-sub">Live postings pulled from real sources, plus a full directory of platforms to work from.</p>

      <LiveJobsView jobs={live.jobs} sourceStatus={live.sourceStatus} fetchedAt={live.fetchedAt} />

      <div className="section-title">📋 Platform Directory</div>
      <JobBoardsView jobBoards={jobBoards} />
    </>
  );
}
