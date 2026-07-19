// Badges are derived on the fly from existing progress state rather than
// stored, so there's nothing to migrate if the earning rules ever change.
export function computeBadges(state, chapters) {
  const doneDays = Object.values(state.roadmap || {}).filter(Boolean).length;
  const dailyDone = Object.values(state.challenge?.daily || {}).filter(Boolean).length;

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
  ];
}
