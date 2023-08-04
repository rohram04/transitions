"use server";

import { cookies } from "next/headers";
import fetch from "../../../../fetch";

export default async function search(song) {
  const response = await fetch(
    "https://api.spotify.com/v1/search?" +
      new URLSearchParams({
        q: song,
        type: "track",
      }),
    {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token").value}`,
      },
    }
  );
  const result = await response.json();
  return result;
}
