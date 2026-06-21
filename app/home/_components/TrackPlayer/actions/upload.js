"use server";
import pg from "@/app/connection";
import { getUser } from "@/app/home/_components/profile/action";
import { resolveYoutubeId } from "./resolveYoutubeId";

export default async function upload(track1, track2, starttime) {
  const user = await getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  try {
    const [youtubevideoid1, youtubevideoid2] = await Promise.all([
      resolveYoutubeId(track1.name, track1.artists[0]?.name || ""),
      resolveYoutubeId(track2.name, track2.artists[0]?.name || ""),
    ]);

    await pg("transitions").insert({
      userid: user.id,
      trackid1: track1.id,
      trackid2: track2.id,
      track1json: JSON.stringify(track1),
      track2json: JSON.stringify(track2),
      youtubevideoid1: youtubevideoid1 || "",
      youtubevideoid2: youtubevideoid2 || "",
      starttime,
      date: new Date(),
    });
  } catch (err) {
    console.error("upload failed:", err);
    return { ok: false, reason: "error" };
  }

  return { ok: true };
}
