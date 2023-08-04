"use server";
import { cookies } from "next/headers";
import fetch from "../../../fetch";

export async function getProfile(userid) {
  "use server";
  const data = await fetch(`https://api.spotify.com/v1/users/${userid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookies().get("access_token").value}`,
    },
  });
  return data.json();
}
