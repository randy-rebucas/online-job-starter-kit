import { notFound } from "next/navigation";
import { Award, Flame, Calendar } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";
import { getAllContent } from "@/lib/content";
import { computeBadges } from "@/lib/badges";
import { CURRENT_STATUS_OPTIONS } from "@/lib/currentStatus";

export default async function PublicProfilePage({ params }) {
  const { slug } = await params;

  await dbConnect();
  const user = await User.findOne({ publicSlug: slug, isPublicProfile: true })
    .select("name currentStatus")
    .lean();
  if (!user) notFound();

  const progress = await UserProgress.findOne({ user: user._id }).lean();
  const state = {
    roadmap: progress?.roadmap || {},
    challenge: progress?.challenge || { daily: {}, milestones: {} },
    chapterChecks: progress?.chapterChecks || {},
    trackers: progress?.trackers || {},
    streaks: progress?.streaks || {},
  };

  const { CHAPTERS } = await getAllContent(["CHAPTERS"]);
  const badges = computeBadges(state, CHAPTERS || []).filter((b) => b.earned);
  const doneDays = Object.values(state.roadmap).filter(Boolean).length;
  const statusLabel = CURRENT_STATUS_OPTIONS.find((o) => o.value === user.currentStatus)?.label || user.currentStatus;

  return (
    <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 16px" }}>
      <div className="card">
        <h1 className="page-title" style={{ marginTop: 0 }}>{user.name}</h1>
        <p className="page-sub">{statusLabel} · Career Progress</p>

        <div className="grid cols-3" style={{ marginTop: 16 }}>
          <div className="card stat">
            <div className="num">{doneDays}/30</div>
            <div className="label">
              <Calendar size={13} style={{ verticalAlign: "middle" }} /> Roadmap Days
            </div>
          </div>
          <div className="card stat">
            <div className="num">{state.streaks?.longestStreak || 0}</div>
            <div className="label">
              <Flame size={13} style={{ verticalAlign: "middle" }} /> Best Streak
            </div>
          </div>
          <div className="card stat">
            <div className="num">{badges.length}</div>
            <div className="label">
              <Award size={13} style={{ verticalAlign: "middle" }} /> Badges Earned
            </div>
          </div>
        </div>

        {badges.length > 0 && (
          <>
            <div className="section-title">
              <Award size={16} /> Badges
            </div>
            <div className="grid cols-2">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="badge"
                  style={{ textAlign: "center", padding: "10px 6px", background: "var(--coral)", color: "#fff" }}
                >
                  {b.label}
                </div>
              ))}
            </div>
          </>
        )}

        <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginTop: 20, textAlign: "center" }}>
          Career progress powered by the Online Job Starter Kit.
        </p>
      </div>
    </div>
  );
}
