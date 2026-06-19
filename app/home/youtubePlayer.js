"use client";
import { useEffect, useRef, useState } from "react";

export default function useYouTubePlayer() {
  const playerRef = useRef(null);
  const [ytReady, setYtReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);
  const onEndedRef = useRef(null);

  useEffect(() => {
    function initPlayer() {
      playerRef.current = new window.YT.Player("yt-player", {
        height: "1",
        width: "1",
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onReady: () => setYtReady(true),
          onStateChange: (event) => {
            const YTState = window.YT.PlayerState;
            if (event.data === YTState.PLAYING) {
              setIsPlaying(true);
              clearInterval(intervalRef.current);
              intervalRef.current = setInterval(() => {
                if (playerRef.current?.getCurrentTime) {
                  setCurrentTime(playerRef.current.getCurrentTime());
                }
              }, 500);
            } else {
              setIsPlaying(false);
              clearInterval(intervalRef.current);
              if (event.data === YTState.ENDED) {
                onEndedRef.current?.();
              }
            }
          },
        },
      });
    }

    if (window.YT?.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = initPlayer;

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return {
    ytReady,
    isPlaying,
    currentTime,
    play: (videoId, startSeconds = 0) => {
      if (!playerRef.current?.loadVideoById) return;
      playerRef.current.loadVideoById({ videoId, startSeconds: Number(startSeconds) });
    },
    pause: () => playerRef.current?.pauseVideo?.(),
    resume: () => playerRef.current?.playVideo?.(),
    seekTo: (seconds) => playerRef.current?.seekTo?.(seconds, true),
    setOnEnded: (cb) => {
      onEndedRef.current = cb;
    },
  };
}
