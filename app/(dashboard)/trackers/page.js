import { getAllContent } from "@/lib/content";
import TrackersView from "./TrackersView";

export default async function TrackersPage() {
  const data = await getAllContent(["TRACKERS", "HABIT_TRACKER_DAYS", "HABIT_TRACKER_ROWS"]);
  return (
    <TrackersView
      trackers={data.TRACKERS || []}
      habitDays={data.HABIT_TRACKER_DAYS || []}
      habitRows={data.HABIT_TRACKER_ROWS || []}
    />
  );
}
