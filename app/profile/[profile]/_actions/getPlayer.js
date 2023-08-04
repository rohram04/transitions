"use server";

import { cookies } from "next/headers";

export default async function getPlayer() {
  return JSON.parse(await cookies().get("player").value);
}
