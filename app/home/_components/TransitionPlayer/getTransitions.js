"use server";
import pg from "@/app/connection";
import { getUser } from "@/app/home/_components/profile/action";

export default async function getTransitions(ids) {
  // Guests (no user) may still browse; `liked` simply resolves to 0 for them.
  const user = await getUser();

  const transitions = await pg("transitions")
    .orderBy(pg.raw("RANDOM()"))
    .limit(3)
    .join("users", { "users.spotifyid": "transitions.userid" })
    .leftJoin("likes", { "likes.transitionid": "transitions.id" })
    .groupBy(
      "transitions.id",
      "users.spotifyid",
      "users.displayname",
      "users.avatarurl"
    )
    .select(
      "transitions.id",
      "transitions.userid",
      "trackid1",
      "trackid2",
      "starttime",
      "track1json",
      "track2json",
      "youtubevideoid1",
      "youtubevideoid2",
      pg.raw(
        `count(case when likes.userid = ? then 1 else null end) as liked`,
        [user?.id ?? null]
      ),
      "users.displayname as profilename",
      "users.avatarurl as profileavatar"
    )
    .count("transitionid", { as: "likes" })
    .whereNotIn("transitions.id", ids.length ? ids : [-1]);

  if (transitions.length === 0) return { transitions: [], tracks: {} };

  const tracks = {};
  for (const t of transitions) {
    const t1 = typeof t.track1json === "string" ? JSON.parse(t.track1json) : t.track1json;
    const t2 = typeof t.track2json === "string" ? JSON.parse(t.track2json) : t.track2json;
    if (t1) tracks[t.trackid1] = t1;
    if (t2) tracks[t.trackid2] = t2;
    t.profile = {
      id: t.userid,
      display_name: t.profilename,
      avatarurl: t.profileavatar,
    };
  }

  return { transitions, tracks };
}
