"use server";
import pg from "../../../connection";
import { cookies } from "next/headers";
import fetch from "../../../fetch";

export default async function getTransitions(user, ids) {
  const transitions = await pg("transitions")
    .orderBy(pg.raw("RANDOM()"))
    .limit(3)
    .join("users", { "users.spotifyid": "transitions.userid" })
    .leftJoin("likes", { "likes.transitionid": "transitions.id" })
    .groupBy("id")
    .select(
      "id",
      "transitions.userid",
      "trackid1",
      "trackid2",
      "starttime",
      "enhanced",
      pg.raw(
        `count(case when likes.userid = ? then 1 else null end) as liked`,
        [user]
      )
    )
    .count("transitionid", { as: "likes" })
    .whereNotIn("id", ids);

  let transitionids = [];
  for (let i in transitions) {
    const response = await fetch(
      `https://api.spotify.com/v1/users/${transitions[i].userid}`
    );
    const profile = await response.json();
    transitions[i]["profile"] = profile;
    transitionids = [
      ...transitionids,
      transitions[i].trackid1,
      transitions[i].trackid2,
    ];
  }

  if (transitions.length === 0) return { transitions, tracks: [] };

  const res = await fetch(
    "https://api.spotify.com/v1/tracks?" +
      new URLSearchParams({ ids: transitionids.toString() }),
    {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token").value}`,
      },
    }
  );

  const { tracks: result } = await res.json();

  const tracks = {};
  for (let track of result) {
    tracks[track.id] = track;
  }

  return { transitions, tracks };
}
