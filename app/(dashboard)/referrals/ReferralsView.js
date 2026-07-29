"use client";

import { useEffect, useState } from "react";
import { Gift, Users, Lock, Trophy } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { inputClass } from "@/components/formStyles";

function Leaderboard() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    fetch("/api/referrals/leaderboard")
      .then((res) => res.json())
      .then(setBoard)
      .catch(() => {});
  }, []);

  if (!board?.top?.length) return null;

  return (
    <div className="card">
      <div className="section-title" style={{ marginTop: 0 }}>
        <Trophy size={18} /> Top Referrers
      </div>
      <table>
        <tbody>
          {board.top.map((r) => (
            <tr key={r.rank} style={r.isYou ? { fontWeight: 700 } : undefined}>
              <td style={{ width: 40 }}>#{r.rank}</td>
              <td>{r.name}{r.isYou ? " (You)" : ""}</td>
              <td style={{ textAlign: "right", color: "var(--text-dim)" }}>{r.invitedCount} invites</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReferralsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referrals")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!data?.code || !data?.url) {
    return <div className="empty-state">Couldn&apos;t load your referral link right now.</div>;
  }

  const { url, invitedCount, tiers } = data;
  const nextTier = tiers.find((t) => !t.earned);
  const pct = nextTier ? Math.min(100, Math.round((invitedCount / nextTier.count) * 100)) : 100;

  return (
    <>
      <h1 className="page-title">
        <Gift size={22} /> Referral Program
      </h1>
      <p className="page-sub">
        Invite friends with your link below. Once a friend buys the kit, it counts toward your rewards.
      </p>

      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          <Users size={18} /> Your Referral Link
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className={inputClass} value={url} readOnly onFocus={(e) => e.target.select()} />
          <CopyButton text={url} className="btn small primary copy-btn" />
        </div>
        <div className="flex-between" style={{ marginTop: 16 }}>
          <strong>{invitedCount} successful invite{invitedCount === 1 ? "" : "s"}</strong>
          {nextTier && <span>{nextTier.count - invitedCount} more to {nextTier.reward}</span>}
        </div>
        <div className="progress-bar" style={{ marginTop: 8 }}>
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>

      <Leaderboard />

      <div className="section-title">
        <Gift size={18} /> Reward Tiers
      </div>
      {tiers.map((t) => (
        <div className="card" key={t.count}>
          <div className="flex-between">
            <strong>
              Invite {t.count} — {t.reward}
            </strong>
            <span
              className="badge"
              style={{
                background: t.earned ? "var(--coral)" : "var(--bg)",
                color: t.earned ? "#fff" : "var(--text-dim)",
              }}
            >
              {t.earned ? "Unlocked" : <><Lock size={12} style={{ verticalAlign: "middle" }} /> Locked</>}
            </span>
          </div>
          {t.earned && !t.auto && (
            <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginTop: 8 }}>
              Message us in the Facebook group or reply to your purchase receipt email to claim this reward.
            </p>
          )}
        </div>
      ))}
    </>
  );
}
