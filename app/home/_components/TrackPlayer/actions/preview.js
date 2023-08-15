"use server";
import { cookies } from "next/headers";
import fetch from "../../../../fetch";
import { json } from "stream/consumers";

export default async function preview(device_id, tracks, position = 0) {
  if (JSON.parse(cookies().get("user").value).product !== "premium") return;

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
}

export async function activate(device_id) {
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
