// A new quote/prompt is picked once per calendar day (no persistence needed)
// by indexing into the list with the day-of-epoch, so every user sees the
// same "today's" pick and it changes automatically at midnight.
export function pickForToday(list) {
  if (!list?.length) return null;
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  return list[daysSinceEpoch % list.length];
}

export const DAILY_QUOTES = [
  { text: "Commit to the Lord whatever you do, and he will establish your plans.", source: "Proverbs 16:3" },
  { text: "For I know the plans I have for you, plans to prosper you and not to harm you.", source: "Jeremiah 29:11" },
  { text: "I can do all things through Christ who strengthens me.", source: "Philippians 4:13" },
  { text: "Whatever you do, work at it with all your heart, as working for the Lord.", source: "Colossians 3:23" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", source: "Proverbs 3:5" },
  { text: "Be strong and courageous. Do not be afraid; the Lord your God goes with you.", source: "Deuteronomy 31:6" },
  { text: "The Lord will fight for you; you need only to be still.", source: "Exodus 14:14" },
  { text: "Cast all your anxiety on him because he cares for you.", source: "1 Peter 5:7" },
  { text: "She is clothed with strength and dignity; she can laugh at the days to come.", source: "Proverbs 31:25" },
  { text: "Let us not become weary in doing good, for at the proper time we will reap a harvest.", source: "Galatians 6:9" },
  { text: "You don't need more experience to start. You need one client, one win, and the courage to begin.", source: "Daily Reminder" },
  { text: "Small, consistent effort beats big, occasional bursts. Show up today.", source: "Daily Reminder" },
  { text: "Every application is a rep. The more reps, the better your odds.", source: "Daily Reminder" },
  { text: "Your first client won't be your last — it's just proof you can start.", source: "Daily Reminder" },
  { text: "Progress, not perfection. Ship the draft, then improve it.", source: "Daily Reminder" },
  { text: "Discipline is choosing between what you want now and what you want most.", source: "Daily Reminder" },
  { text: "Rejection is redirection. Keep sending applications.", source: "Daily Reminder" },
  { text: "The best time to apply was this morning. The next best time is now.", source: "Daily Reminder" },
  { text: "Momentum is built one small task at a time. Do the next right thing.", source: "Daily Reminder" },
  { text: "Success is the sum of small efforts repeated day in and day out.", source: "Robert Collier" },
];
