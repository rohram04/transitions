"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const YouTubePlayerContext = createContext(null);
const SLOT_IDS = [0, 1];

function createSlotController(
  index,
  playerRefs,
  onEndedRefs,
  cuedVideoIdRefs,
  cuedStartSecondsRefs
) {
  const getPlayer = () => playerRefs.current[index];

  return {
    cue(videoId, startSeconds = 0) {
      const player = getPlayer();
      if (!player?.cueVideoById) return;
      const start = Number(startSeconds);
      player.cueVideoById({ videoId, startSeconds: start });
      cuedVideoIdRefs.current[index] = videoId;
      cuedStartSecondsRefs.current[index] = start;
    },
    play(videoId, startSeconds = 0) {
      const player = getPlayer();
      if (!player) return;
      const start = Number(startSeconds);

      if (cuedVideoIdRefs.current[index] === videoId && player.playVideo) {
        if (Math.abs(cuedStartSecondsRefs.current[index] - start) >= 0.5) {
          player.seekTo?.(start, true);
          cuedStartSecondsRefs.current[index] = start;
        }
        player.playVideo();
        return;
      }

      if (player.loadVideoById) {
        player.loadVideoById({ videoId, startSeconds: start });
        cuedVideoIdRefs.current[index] = videoId;
        cuedStartSecondsRefs.current[index] = start;
      }
    },
    pause: () => getPlayer()?.pauseVideo?.(),
    resume: () => getPlayer()?.playVideo?.(),
    seekTo: (seconds) => getPlayer()?.seekTo?.(seconds, true),
    setOnEnded: (cb) => {
      onEndedRefs.current[index] = cb;
    },
    getTime: () => (getPlayer()?.getCurrentTime?.() ?? 0) * 1000,
    getIsPlaying: () => getPlayer()?.getPlayerState?.() === 1,
  };
}

export function YouTubePlayerProvider({ children }) {
  const playerRefs = useRef([null, null]);
  const [ytReady, setYtReady] = useState(false);
  const onEndedRefs = useRef([null, null]);
  const cuedVideoIdRefs = useRef([null, null]);
  const cuedStartSecondsRefs = useRef([0, 0]);
  const ownerRef = useRef(null);
  const readyCountRef = useRef(0);

  useEffect(() => {
    let active = true;

    function initPlayer(slotIndex) {
      if (!active || playerRefs.current[slotIndex]) return;
      const mount = document.getElementById(`yt-player-${slotIndex}`);
      if (!mount) return;

      mount.replaceChildren();
      const inner = document.createElement("div");
      mount.appendChild(inner);

      playerRefs.current[slotIndex] = new window.YT.Player(inner, {
        height: "1",
        width: "1",
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onReady: () => {
            if (!active) return;
            readyCountRef.current += 1;
            if (readyCountRef.current >= SLOT_IDS.length) {
              setYtReady(true);
            }
          },
          onStateChange: (event) => {
            if (!active) return;
            if (event.data === 0 /* YT.PlayerState.ENDED */) {
              onEndedRefs.current[slotIndex]?.();
            }
          },
        },
      });
    }

    function initAllPlayers() {
      SLOT_IDS.forEach(initPlayer);
    }

    if (window.YT?.Player) {
      initAllPlayers();
    } else if (
      !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    ) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initAllPlayers;
    } else {
      window.onYouTubeIframeAPIReady = initAllPlayers;
    }

    const fallback = setTimeout(() => {
      if (active) setYtReady(true);
    }, 8000);

    return () => {
      active = false;
      clearTimeout(fallback);
      SLOT_IDS.forEach((i) => {
        playerRefs.current[i]?.destroy?.();
        playerRefs.current[i] = null;
        onEndedRefs.current[i] = null;
        cuedVideoIdRefs.current[i] = null;
        cuedStartSecondsRefs.current[i] = 0;
      });
      readyCountRef.current = 0;
    };
  }, []);

  const slot0 = createSlotController(
    0,
    playerRefs,
    onEndedRefs,
    cuedVideoIdRefs,
    cuedStartSecondsRefs
  );
  const slot1 = createSlotController(
    1,
    playerRefs,
    onEndedRefs,
    cuedVideoIdRefs,
    cuedStartSecondsRefs
  );

  const value = {
    ytReady,
    slot0,
    slot1,
    pauseAll: () => {
      slot0.pause();
      slot1.pause();
    },
    setOwner: (owner) => {
      ownerRef.current = owner;
    },
    getOwner: () => ownerRef.current,
  };

  return (
    <YouTubePlayerContext.Provider value={value}>
      {children}
      {SLOT_IDS.map((i) => (
        <div
          key={i}
          id={`yt-player-${i}`}
          className="fixed bottom-0 left-0 pointer-events-none"
          style={{ width: 1, height: 1, opacity: 0 }}
        />
      ))}
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
