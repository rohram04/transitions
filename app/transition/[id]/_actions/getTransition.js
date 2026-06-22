"use server";
import pg from "@/app/connection";
import { getUser } from "@/app/home/_components/profile/action";

// Fetch a single transition (+ both tracks' inline metadata) by id, in the
// same shape TransitionPlayer expects from the feed: { transition, tracks }.
// Returns null when the id is missing/invalid so callers can 404.
//
// User-aware for the `liked` flag, but safe for anonymous callers (guests and
// link-preview crawlers have no session, so getUser resolves to null and
// `liked` is simply 0).
export async function getTransition(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return null;

  const user = await getUser();

  const rows = await pg("transitions")
    .where("transitions.id", numericId)
    .join("users", { "users.id": "transitions.user_id" })
    .leftJoin("likes", { "likes.transition_id": "transitions.id" })
    .groupBy(
      "transitions.id",
      "users.id",
      "users.display_name",
      "users.avatar_url"
    )
    .select(
      "transitions.id",
      "transitions.user_id",
      "track1_id",
      "track2_id",
      "start_time",
      "track1_json",
      "track2_json",
      "youtube_video_id_1",
      "youtube_video_id_2",
      pg.raw(
        `count(case when likes.user_id = ? then 1 else null end) as liked`,
        [user?.id ?? null]
      ),
      "users.display_name as profilename",
      "users.avatar_url as profileavatar"
    )
    .count("transition_id", { as: "likes" });

  const t = rows[0];
  if (!t) return null;

  const t1 =
    typeof t.track1_json === "string" ? JSON.parse(t.track1_json) : t.track1_json;
  const t2 =
    typeof t.track2_json === "string" ? JSON.parse(t.track2_json) : t.track2_json;

  const tracks = {};
  if (t1) tracks[t.track1_id] = t1;
  if (t2) tracks[t.track2_id] = t2;

  t.profile = {
    id: t.user_id,
    display_name: t.profilename,
    avatar_url: t.profileavatar,
  };

  return { transition: t, tracks };
}
