import { unstable_cache } from "next/cache";
import { dbConnect } from "@/lib/mongodb";
import Content from "@/models/Content";

// Reference content is seeded once and rarely changes, so cache reads across
// requests instead of hitting Mongo on every page render. Re-seeding busts the
// cache automatically after CONTENT_CACHE_SECONDS.
const CONTENT_CACHE_SECONDS = 300;

const getContentUncached = async (key) => {
  await dbConnect();
  const doc = await Content.findOne({ key }).lean();
  return doc ? doc.data : null;
};

const getAllContentUncached = async (keys) => {
  await dbConnect();
  const docs = await Content.find({ key: { $in: keys } }).lean();
  const map = {};
  for (const doc of docs) map[doc.key] = doc.data;
  return map;
};

export function getContent(key) {
  return unstable_cache(() => getContentUncached(key), ["content", key], {
    revalidate: CONTENT_CACHE_SECONDS,
    tags: ["content", `content:${key}`],
  })();
}

export function getAllContent(keys) {
  return unstable_cache(() => getAllContentUncached(keys), ["content-all", ...keys].sort(), {
    revalidate: CONTENT_CACHE_SECONDS,
    tags: ["content", ...keys.map((k) => `content:${k}`)],
  })();
}
