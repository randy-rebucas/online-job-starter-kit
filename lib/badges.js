import { countApplications } from "@/lib/trackerStatus";

// Badges are derived on the fly from existing progress state rather than
// stored, so there's nothing to migrate if the earning rules ever change.
export function computeBadges(state, chapters, extra) {
  const doneDays = Object.values(state.roadmap || {}).filter(Boolean).length;
  const dailyDone = Object.values(state.challenge?.daily || {}).filter(Boolean).length;
  const streak = state.streaks?.longestStreak || 0;
  const applications = countApplications(state.trackers);
  const invitedCount = extra?.invitedCount || 0;

  let totalChecks = 0;
  let doneChecks = 0;
  (chapters || []).forEach((ch) => {
    ch.checklist.forEach((_, i) => {
      totalChecks++;
      if (state.chapterChecks?.[`${ch.id}-${i}`]) doneChecks++;
    });
  });

  return [
    { id: "week1", label: "Week 1 Complete", earned: doneDays >= 7 },
    { id: "challenge-starter", label: "Challenge Starter", earned: dailyDone >= 1 },
    { id: "guide-finisher", label: "Full Guide Read", earned: totalChecks > 0 && doneChecks === totalChecks },
    { id: "roadmap-finisher", label: "30-Day Finisher", earned: doneDays >= 30 },
    { id: "first-application", label: "First Application Sent", earned: applications >= 1 },
    { id: "job-hunter", label: "Job Hunter (10 Applications)", earned: applications >= 10 },
    { id: "application-machine", label: "Application Machine (25 Applications)", earned: applications >= 25 },
    { id: "streak-7", label: "7-Day Streak", earned: streak >= 7 },
    { id: "streak-30", label: "30-Day Streak", earned: streak >= 30 },
    { id: "recruiter", label: "Recruiter (5 Referrals)", earned: invitedCount >= 5 },
  ];
}
