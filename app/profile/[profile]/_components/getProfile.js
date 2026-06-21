"use server";
import pg from "@/app/connection";

export async function getProfile(userid) {
  const user = await pg("users")
    .where("spotifyid", userid)
    .select(
      "spotifyid as id",
      "displayname as display_name",
      "avatarurl"
    )
    .first();
  return user || null;
}
