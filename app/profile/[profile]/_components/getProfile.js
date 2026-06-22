"use server";
import pg from "@/app/connection";

export async function getProfile(userid) {
  const user = await pg("users")
    .where("id", userid)
    .select("id", "display_name", "avatar_url")
    .first();
  return user || null;
}
