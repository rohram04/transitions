"use server";

import pg from "../../../../connection";
import { cookies } from "next/headers";

export default async function upload(trackid1, trackid2, starttime, enhanced) {
  const { id } = JSON.parse(cookies().get("user").value);
  const result = await pg("transitions").insert({
    userid: id,
    trackid1,
    trackid2,
    starttime,
    enhanced,
    date: new Date(),
  });
}
