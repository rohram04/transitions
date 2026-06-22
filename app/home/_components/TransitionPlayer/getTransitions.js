"use server";
import pg from "@/app/connection";
import { getUser } from "@/app/home/_components/profile/action";

export default async function getTransitions(ids) {
  // Guests (no user) may still browse; `liked` simply resolves to 0 for them.
  const user = await getUser();

  const transitions = await pg("transitions")
    .orderBy(pg.raw("RANDOM()"))
    .limit(3)
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
    .count("transition_id", { as: "likes" })
    .whereNotIn("transitions.id", ids.length ? ids : [-1]);

  if (transitions.length === 0) return { transitions: [], tracks: {} };

  const tracks = {};
  for (const t of transitions) {
    const t1 = typeof t.track1_json === "string" ? JSON.parse(t.track1_json) : t.track1_json;
    const t2 = typeof t.track2_json === "string" ? JSON.parse(t.track2_json) : t.track2_json;
    if (t1) tracks[t.track1_id] = t1;
    if (t2) tracks[t.track2_id] = t2;
    t.profile = {
      id: t.user_id,
      display_name: t.profilename,
      avatar_url: t.profileavatar,
    };
  }

  return { transitions, tracks };
}
