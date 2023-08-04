"use server";
import { cookies } from "next/headers";

export async function setPlayerCookie(player) {
  console.log("hellomeme");
  return cookies().set("player", player);
}
