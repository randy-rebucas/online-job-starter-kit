import { unstable_cache } from "next/cache";

// Live job postings pulled server-side from providers that publish real, free,
// public APIs (no scraping, no ToS violations). Upwork/Fiverr/etc. have no
// public jobs API, so they stay in the static reference directory only.
const LIVE_JOB_CACHE_SECONDS = 900; // 15 min — fresh enough, gentle on rate limits.
const FETCH_TIMEOUT_MS = 8000;
const PER_SOURCE_LIMIT = 40;

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "online-job-starter-kit/1.0 (+https://github.com)" },
    });
    if (!res.ok) throw new Error(`${url} responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchRemotive() {
  const data = await fetchJson("https://remotive.com/api/remote-jobs");
  return (data.jobs || []).slice(0, PER_SOURCE_LIMIT).map((j) => ({
    id: `remotive-${j.id}`,
    source: "Remotive",
    title: j.title,
    company: j.company_name,
    url: j.url,
    location: j.candidate_required_location || "Remote",
    tags: (j.tags || []).slice(0, 5),
    postedAt: j.publication_date || null,
  }));
}

async function fetchRemoteOK() {
  const data = await fetchJson("https://remoteok.com/api");
  // The first array element is a legal/notice object, not a job.
  return (data || [])
    .filter((j) => j && j.id && j.url)
    .slice(0, PER_SOURCE_LIMIT)
    .map((j) => ({
      id: `remoteok-${j.id}`,
      source: "Remote OK",
      title: j.position,
      company: j.company,
      url: j.url,
      location: j.location || "Remote",
      tags: (j.tags || []).slice(0, 5),
      postedAt: j.date || null,
    }));
}

async function fetchArbeitnow() {
  const data = await fetchJson("https://www.arbeitnow.com/api/job-board-api");
  return (data.data || []).slice(0, PER_SOURCE_LIMIT).map((j) => ({
    id: `arbeitnow-${j.slug}`,
    source: "Arbeitnow",
    title: j.title,
    company: j.company_name,
    url: j.url,
    location: j.remote ? "Remote" : j.location || "Remote",
    tags: (j.tags || []).slice(0, 5),
    postedAt: j.created_at ? new Date(j.created_at * 1000).toISOString() : null,
  }));
}

const SOURCES = [
  { name: "Remotive", fetcher: fetchRemotive },
  { name: "Remote OK", fetcher: fetchRemoteOK },
  { name: "Arbeitnow", fetcher: fetchArbeitnow },
];

async function fetchLiveJobsUncached() {
  const results = await Promise.allSettled(SOURCES.map((s) => s.fetcher()));

  const jobs = [];
  const sourceStatus = {};
  results.forEach((result, i) => {
    const name = SOURCES[i].name;
    if (result.status === "fulfilled") {
      sourceStatus[name] = { ok: true, count: result.value.length };
      jobs.push(...result.value);
    } else {
      sourceStatus[name] = { ok: false, error: String(result.reason?.message || result.reason) };
    }
  });

  jobs.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));

  return { jobs, sourceStatus, fetchedAt: new Date().toISOString() };
}

export function getLiveJobs() {
  return unstable_cache(fetchLiveJobsUncached, ["live-jobs"], {
    revalidate: LIVE_JOB_CACHE_SECONDS,
    tags: ["live-jobs"],
  })();
}
