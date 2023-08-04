"use server";

import { cookies } from "next/headers";

export default async function getToken() {
  return cookies().get("access_token").value;
}

// export const setPlayer = async ({ player, device_id }) =>
//   cookies().set("player", { player, device_id });

// export const newUser = async(id) => {
//   pg.insert({id})
// }

// export const upload()

// export const getPlayer = async () => cookies().get("player").value;
