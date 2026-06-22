"use server";
import pg from "@/app/connection";
import ytSearch from "yt-search";

export async function resolveYoutubeId(trackName, artistName) {
  const fingerprint = `${trackName}_${artistName}`.toLowerCase().replace(/\s+/g, "_");

  // 1. Check DB cache
  const cached = await pg("youtube_cache")
    .where("fingerprint", fingerprint)
    .select("video_id")
    .first();
  if (cached) return cached.video_id;

  // 2. Try yt-search (no API key, scrapes YouTube)
  try {
    const query = `${trackName} ${artistName} official audio`;
    const results = await ytSearch(query);
    const video = results.videos?.[0];
    if (video?.videoId) {
      await pg("youtube_cache")
        .insert({ fingerprint, video_id: video.videoId })
        .onConflict("fingerprint")
        .ignore();
      return video.videoId;
    }
  } catch (e) {
    console.error("yt-search failed:", e.message);
  }

  // 3. Fallback: YouTube Data API v3 (costs quota, use sparingly)
  if (process.env.YOUTUBE_API_KEY) {
    try {
      const ytUrl =
        "https://www.googleapis.com/youtube/v3/search?" +
        new URLSearchParams({
          part: "snippet",
          q: `${trackName} ${artistName} official audio`,
          type: "video",
          videoCategoryId: "10",
          maxResults: "1",
          key: process.env.YOUTUBE_API_KEY,
        });
      const res = await fetch(ytUrl);
      const data = await res.json();
      const videoId = data.items?.[0]?.id?.videoId;
      if (videoId) {
        await pg("youtube_cache")
          .insert({ fingerprint, video_id: videoId })
          .onConflict("fingerprint")
          .ignore();
        return videoId;
      }
    } catch (e) {
      console.error("YouTube API fallback failed:", e.message);
    }
  }

  return null;
}
