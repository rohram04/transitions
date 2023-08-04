"use server";
import { cookies } from "next/headers";
import pg from "../../../connection";
import fetch from "../../../fetch";

export async function getTransitions(user) {
  const transitions = await pg("transitions")
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
    .where({
      spotifyid: user,
    })
    .count("transitionid", { as: "likes" });

  const response = await fetch(`https://api.spotify.com/v1/users/${user}`);
  const profile = await response.json();

  let transitionids = [];
  for (let i in transitions) {
    transitions[i].profile = profile;
    const transition = transitions[i];
    transitionids = [
      ...transitionids,
      transition.trackid1,
      transition.trackid2,
    ];
  }
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
