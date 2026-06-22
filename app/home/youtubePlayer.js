"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const YouTubePlayerContext = createContext(null);

export function YouTubePlayerProvider({ children }) {
  const playerRef = useRef(null);
  const [ytReady, setYtReady] = useState(false);
  const onEndedRef = useRef(null);
  // Tracks which component currently "owns" playback ("main" | "modal" | null).
  const ownerRef = useRef(null);
  const cuedVideoIdRef = useRef(null);
  const cuedStartSecondsRef = useRef(0);

  useEffect(() => {
    let active = true;

    function initPlayer() {
      if (!active || playerRef.current) return;
      const mount = document.getElementById("yt-player");
      if (!mount) return;

      // Hand YouTube its OWN child node to replace with the iframe. If we pass
      // the React-managed #yt-player div directly, the API swaps that exact node
      // out, leaving React with a stale reference -> "removeChild: not a child"
      // on the next navigation/reconcile. React only ever manages the empty host.
      mount.replaceChildren(); // drop any orphan from a prior init (dev StrictMode)
      const inner = document.createElement("div");
      mount.appendChild(inner);

      playerRef.current = new window.YT.Player(inner, {
        height: "1",
        width: "1",
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onReady: () => {
            if (active) setYtReady(true);
          },
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
    } else if (
      !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    ) {
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
      playerRef.current?.destroy?.();
      playerRef.current = null;
      cuedVideoIdRef.current = null;
      cuedStartSecondsRef.current = 0;
    };
  }, []);

  const value = {
    ytReady,
    cue: (videoId, startSeconds = 0) => {
      const player = playerRef.current;
      if (!player?.cueVideoById) return;
      const start = Number(startSeconds);
      player.cueVideoById({ videoId, startSeconds: start });
      cuedVideoIdRef.current = videoId;
      cuedStartSecondsRef.current = start;
    },
    play: (videoId, startSeconds = 0) => {
      const player = playerRef.current;
      if (!player) return;
      const start = Number(startSeconds);

      if (cuedVideoIdRef.current === videoId && player.playVideo) {
        if (Math.abs(cuedStartSecondsRef.current - start) >= 0.5) {
          player.seekTo?.(start, true);
          cuedStartSecondsRef.current = start;
        }
        player.playVideo();
        return;
      }

      if (player.loadVideoById) {
        player.loadVideoById({ videoId, startSeconds: start });
        cuedVideoIdRef.current = videoId;
        cuedStartSecondsRef.current = start;
      }
    },
    pause: () => playerRef.current?.pauseVideo?.(),
    resume: () => playerRef.current?.playVideo?.(),
    seekTo: (seconds) => playerRef.current?.seekTo?.(seconds, true),
    setOnEnded: (cb) => {
      onEndedRef.current = cb;
    },
    getTime: () => (playerRef.current?.getCurrentTime?.() ?? 0) * 1000,
    getIsPlaying: () => playerRef.current?.getPlayerState?.() === 1,
    setOwner: (owner) => {
      ownerRef.current = owner;
    },
    getOwner: () => ownerRef.current,
  };

  return (
    <YouTubePlayerContext.Provider value={value}>
      {children}
      {/* Single persistent mount — YouTube mutates this DOM; keep it out of page trees. */}
      <div
        id="yt-player"
        className="fixed bottom-0 left-0 pointer-events-none"
        style={{ width: 1, height: 1, opacity: 0 }}
      />
    </YouTubePlayerContext.Provider>
  );
}

export default function useYouTubePlayer() {
  const ctx = useContext(YouTubePlayerContext);
  if (!ctx) {
    throw new Error("useYouTubePlayer must be used within YouTubePlayerProvider");
  }
  return ctx;
}
