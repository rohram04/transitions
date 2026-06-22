import { useState, useRef, useContext, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SelectBox from "./selectBox";
import { resolveYoutubeId } from "./actions/resolveYoutubeId";
import upload from "./actions/upload";
import { BiPlay, BiPause, BiPlus } from "react-icons/bi";
import { CgRedo, CgSpinner } from "react-icons/cg";
import Logo from "../logo";
import ToastContext from "../toast";

function trackFingerprint(name, artist) {
  return `${name}_${artist}`.toLowerCase().replace(/\s+/g, "_");
}

function trackStartMs(slot, entry) {
  if (slot === 0) {
    return entry.time ?? entry.position ?? entry.track.duration_ms - 15000;
  }
  return 0;
}

export default function TrackPlayer({
  ytPlayer,
  selectedTracks,
  selectedTracksDispatch,
  setPreviewing,
  previewing,
  playingKey,
  setPlayingKey,
  onClose,
  onModalPreviewStart,
  className = "",
}) {
  const [previewTime, setPreviewTime] = useState(0);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [videoIds, setVideoIds] = useState({});
  const [fingerprints, setFingerprints] = useState({});
  const [resolving, setResolving] = useState({});
  const previewIntervalRef = useRef(null);
  const frozenTrack1TimeRef = useRef(0);
  const videoIdsRef = useRef(videoIds);
  const fingerprintsRef = useRef(fingerprints);
  const prefetchGenRef = useRef({ 0: 0, 1: 0 });
  const selectedTracksRef = useRef(selectedTracks);
  const reduceMotion = useReducedMotion();
  const showToast = useContext(ToastContext);

  useEffect(() => {
    videoIdsRef.current = videoIds;
  }, [videoIds]);

  useEffect(() => {
    fingerprintsRef.current = fingerprints;
  }, [fingerprints]);

  useEffect(() => {
    selectedTracksRef.current = selectedTracks;
  }, [selectedTracks]);

  // Prefetch YouTube video ids when tracks are selected (cue track 0 only).
  useEffect(() => {
    for (const key of [0, 1]) {
      if (!(key in selectedTracks)) {
        prefetchGenRef.current[key]++;
        setVideoIds((prev) => {
          if (!(key in prev)) return prev;
          const next = { ...prev };
          delete next[key];
          return next;
        });
        setFingerprints((prev) => {
          if (!(key in prev)) return prev;
          const next = { ...prev };
          delete next[key];
          return next;
        });
        setResolving((prev) => {
          if (!(key in prev)) return prev;
          const next = { ...prev };
          delete next[key];
          return next;
        });
        continue;
      }

      const entry = selectedTracks[key];
      const track = entry.track;
      const artist = track.artists?.[0]?.name || "";
      const fp = trackFingerprint(track.name, artist);

      if (fingerprintsRef.current[key] === fp && videoIdsRef.current[key]) {
        if (key === 0 && playingKey !== 0 && !localIsPlaying) {
          ytPlayer?.cue?.(
            videoIdsRef.current[key],
            trackStartMs(0, entry) / 1000
          );
        }
        continue;
      }

      const gen = ++prefetchGenRef.current[key];
      setResolving((prev) => ({ ...prev, [key]: true }));

      resolveYoutubeId(track.name, artist).then((id) => {
        if (prefetchGenRef.current[key] !== gen) return;

        setResolving((prev) => ({ ...prev, [key]: false }));
        if (!id) return;

        setVideoIds((prev) => ({ ...prev, [key]: id }));
        setFingerprints((prev) => ({ ...prev, [key]: fp }));

        // Single hidden player — only cue track 0 before preview starts.
        if (key === 0 && playingKey !== 0 && !localIsPlaying) {
          ytPlayer?.cue?.(id, trackStartMs(0, entry) / 1000);
        }
      });
    }
  }, [selectedTracks, ytPlayer, playingKey, localIsPlaying]);

  const track0Time = selectedTracks[0]?.time;

  // Re-cue track 0 when scrubber changes while not playing track 0.
  useEffect(() => {
    if (!(0 in selectedTracks)) return;
    if (playingKey === 0 && localIsPlaying) return;
    const videoId = videoIdsRef.current[0];
    if (!videoId) return;
    ytPlayer?.cue?.(videoId, trackStartMs(0, selectedTracks[0]) / 1000);
  }, [track0Time, playingKey, localIsPlaying, ytPlayer, selectedTracks]);

  const stopPreviewInterval = () => {
    clearInterval(previewIntervalRef.current);
    previewIntervalRef.current = null;
  };

  const startPreviewInterval = () => {
    stopPreviewInterval();
    previewIntervalRef.current = setInterval(() => {
      if (ytPlayer?.getTime) {
        setPreviewTime(ytPlayer.getTime());
      }
    }, 500);
  };

  const removeTrack = (key) => {
    ytPlayer?.pause();
    stopPreviewInterval();
    setPreviewTime(0);
    setLocalIsPlaying(false);
    prefetchGenRef.current[key]++;
    selectedTracksDispatch({ type: "REMOVE_TRACK", key });
    setPreviewing(false);
    setPlayingKey(null);
  };

  const startPreview = async (position) => {
    if (!(0 in selectedTracks)) return;

    onModalPreviewStart?.();
    ytPlayer?.setOwner?.("modal");

    let videoId = videoIdsRef.current[0];
    if (!videoId) {
      const track = selectedTracks[0].track;
      setResolving((prev) => ({ ...prev, 0: true }));
      videoId = await resolveYoutubeId(
        track.name,
        track.artists?.[0]?.name || ""
      );
      setResolving((prev) => ({ ...prev, 0: false }));
      if (!videoId) return;
      setVideoIds((prev) => ({ ...prev, 0: videoId }));
    }

    ytPlayer?.setOnEnded?.(async () => {
      const tracks = selectedTracksRef.current;
      if (!(1 in tracks)) return;

      let track2VideoId = videoIdsRef.current[1];
      if (!track2VideoId) {
        const track2 = tracks[1].track;
        track2VideoId = await resolveYoutubeId(
          track2.name,
          track2.artists?.[0]?.name || ""
        );
        if (!track2VideoId) return;
        setVideoIds((prev) => ({ ...prev, 1: track2VideoId }));
      }

      frozenTrack1TimeRef.current = ytPlayer.getTime?.() ?? previewTime;
      ytPlayer.play(track2VideoId, 0);
      setPlayingKey(1);
      setPreviewTime(0);
    });

    ytPlayer?.play(videoId, position / 1000);
    setPlayingKey(0);
    setPreviewing(true);
    setPreviewTime(position);
    setLocalIsPlaying(true);
    startPreviewInterval();
  };

  const playPreviewDisabled =
    !(0 in selectedTracks) || (resolving[0] && !previewing);

  return (
    <div className={"flex flex-col md:pl-4 grow md:w-2/3 " + className}>
      <div className="fixed w-full left-0 top-0 pt-2 px-4 z-20">
        <Logo onClose={onClose} />
      </div>
      <div className="flex flex-col sm:flex-row grow min-h-0 justify-center sm:justify-normal">
        <SelectBox
          track={
            selectedTracks[0]
              ? {
                  ...selectedTracks[0],
                  position:
                    playingKey === 0
                      ? previewTime
                      : playingKey === 1
                        ? frozenTrack1TimeRef.current
                        : selectedTracks[0].position,
                }
              : undefined
          }
          removeTrack={() => removeTrack(0)}
          preparing={resolving[0] && !localIsPlaying && playingKey !== 0}
          onChange={(ev) =>
            selectedTracksDispatch({
              type: "TIME",
              key: 0,
              time: ev.target.value,
            })
          }
          spinning={playingKey === 0 && localIsPlaying}
        />
        <SelectBox
          track={
            selectedTracks[1]
              ? {
                  ...selectedTracks[1],
                  position:
                    playingKey === 1 ? previewTime : selectedTracks[1].position,
                }
              : undefined
          }
          removeTrack={() => removeTrack(1)}
          spinning={playingKey === 1 && localIsPlaying}
        />
      </div>
      <div className="mx-auto mt-2 flex w-full max-w-md items-center justify-center gap-3 sm:gap-5 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 shadow-2xl backdrop-blur-2xl">
        <motion.button
          whileTap={reduceMotion ? undefined : { scale: 0.85 }}
          onClick={async () => {
            if (localIsPlaying) {
              stopPreviewInterval();
              setPreviewTime(0);
              await startPreview(selectedTracks[0]?.time || 0);
            } else {
              selectedTracksDispatch({
                type: "POSITION",
                key: 0,
                position: selectedTracks[0]?.time || 0,
              });
              selectedTracksDispatch({ type: "POSITION", key: 1, position: 0 });
              stopPreviewInterval();
              setPreviewTime(0);
              setLocalIsPlaying(false);
              setPreviewing(false);
              setPlayingKey(null);
            }
          }}
          className="h-11 w-11 rounded-full p-1.5 text-white hover:bg-white/10 transition"
          aria-label="Reset preview"
        >
          <CgRedo size="100%" />
        </motion.button>
        <motion.button
          whileTap={reduceMotion ? undefined : { scale: 0.85 }}
          disabled={playPreviewDisabled}
          onClick={async () => {
            if (previewing && localIsPlaying) {
              ytPlayer.pause();
              stopPreviewInterval();
              setLocalIsPlaying(false);
              return;
            }
            if (previewing && !localIsPlaying) {
              ytPlayer?.resume();
              startPreviewInterval();
              setLocalIsPlaying(true);
              return;
            }
            await startPreview(
              selectedTracks[0]?.position || selectedTracks[0]?.time || 0
            );
          }}
          className="h-14 w-14 rounded-full bg-white text-slate-950 shadow-lg hover:scale-105 transition flex items-center justify-center disabled:opacity-40 disabled:hover:scale-100"
          aria-label={localIsPlaying ? "Pause preview" : "Play preview"}
        >
          {resolving[0] && !previewing ? (
            <CgSpinner size="80%" className="animate-spin" />
          ) : localIsPlaying ? (
            <BiPause size="80%" />
          ) : (
            <BiPlay size="80%" className="translate-x-[2px]" />
          )}
        </motion.button>
        <motion.button
          whileTap={reduceMotion ? undefined : { scale: 0.85 }}
          onClick={async () => {
            if (Object.keys(selectedTracks).length !== 2) return;
            const res = await upload(
              selectedTracks[0].track,
              selectedTracks[1].track,
              selectedTracks[0].time
            );
            if (res?.ok) {
              removeTrack(0);
              removeTrack(1);
              onClose();
            } else if (res?.reason === "unauthenticated") {
              showToast?.(
                "error",
                <span>
                  Sign up or{" "}
                  <a href="/login" className="underline font-medium">
                    sign in
                  </a>{" "}
                  to upload transitions.
                </span>
              );
            } else {
              showToast?.("error", <span>Upload failed — please try again.</span>);
            }
          }}
          className="h-11 w-11 rounded-full p-1.5 text-white hover:bg-white/10 transition"
          aria-label="Upload transition"
        >
          <BiPlus size="100%" />
        </motion.button>
      </div>
    </div>
  );
}
