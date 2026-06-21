"use client";

import { YouTubePlayerProvider } from "./home/youtubePlayer";

export default function Providers({ children }) {
  return <YouTubePlayerProvider>{children}</YouTubePlayerProvider>;
}
