"use server";
import { cookies } from "next/headers";
import fetch from "../../../../fetch";

export default async function preview(device_id, tracks, position = 0) {
  // console.log(cookies().get("access_token").value);
  console.log(tracks);
  const response2 = await fetch(
    "https://api.spotify.com/v1/me/player/play?" +
      new URLSearchParams({ device_id }),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cookies().get("access_token").value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: tracks.map(({ uri }) => uri),
        position_ms: position,
      }),
    }
  );
  // console.log(response2);
  console.log(await response2.text());
}

export async function activate(device_id) {
  console.log(device_id);
  const response = await fetch("https://api.spotify.com/v1/me/player/", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cookies().get("access_token").value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_ids: [device_id],
      play: "true",
    }),
  });
  console.log(response);
  return;
}

export async function next() {
  const response2 = await fetch("https://api.spotify.com/v1/me/player/next", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cookies().get("access_token").value}`,
      // "Content-Type": "application/json",
    },
  });
}
