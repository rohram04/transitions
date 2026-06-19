"use client";
import { useEffect, useRef, useState } from "react";

export default function useYouTubePlayer() {
  const playerRef = useRef(null);
  const [ytReady, setYtReady] = useState(false);
  const onEndedRef = useRef(null);
  // Tracks which component currently "owns" playback ("main" | "modal" | null).
  // Each component only updates its own progress when it is the owner.
  const ownerRef = useRef(null);

  useEffect(() => {
    let active = true;

    function initPlayer() {
      if (!active || playerRef.current) return;
      playerRef.current = new window.YT.Player("yt-player", {
        height: "1",
        width: "1",
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onReady: () => { if (active) setYtReady(true); },
          onStateChange: (event) => {
            if (!active) return;
            if (event.data === 0 /* YT.PlayerState.ENDED */) {
              onEndedRef.current?.();
            }
          },
        },
      });
    }

    if (window.YT?.Player) {
      initPlayer();
    } else if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    const fallback = setTimeout(() => {
      if (active) setYtReady(true);
    }, 8000);

    return () => {
      active = false;
      clearTimeout(fallback);
    };
  }, []);

  return {
    ytReady,
    play: (videoId, startSeconds = 0) => {
      if (!playerRef.current?.loadVideoById) return;
      playerRef.current.loadVideoById({ videoId, startSeconds: Number(startSeconds) });
    },
    pause: () => playerRef.current?.pauseVideo?.(),
    resume: () => playerRef.current?.playVideo?.(),
    seekTo: (seconds) => playerRef.current?.seekTo?.(seconds, true),
    setOnEnded: (cb) => { onEndedRef.current = cb; },
    getTime: () => (playerRef.current?.getCurrentTime?.() ?? 0) * 1000,
    getIsPlaying: () => playerRef.current?.getPlayerState?.() === 1,
    setOwner: (owner) => { ownerRef.current = owner; },
    getOwner: () => ownerRef.current,
  };
}
