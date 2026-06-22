"use server";
import pg from "@/app/connection";
import { getUser } from "@/app/home/_components/profile/action";
import { resolveYoutubeId } from "./resolveYoutubeId";

export default async function upload(track1, track2, start_time) {
  const user = await getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  try {
    const [youtube_video_id_1, youtube_video_id_2] = await Promise.all([
      resolveYoutubeId(track1.name, track1.artists[0]?.name || ""),
      resolveYoutubeId(track2.name, track2.artists[0]?.name || ""),
    ]);

    await pg("transitions").insert({
      user_id: user.id,
      track1_id: track1.id,
      track2_id: track2.id,
      track1_json: JSON.stringify(track1),
      track2_json: JSON.stringify(track2),
      youtube_video_id_1: youtube_video_id_1 || "",
      youtube_video_id_2: youtube_video_id_2 || "",
      start_time,
      created_at: new Date(),
    });
  } catch (err) {
    console.error("upload failed:", err);
    return { ok: false, reason: "error" };
  }

  return { ok: true };
}
