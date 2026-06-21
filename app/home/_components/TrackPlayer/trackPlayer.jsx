import { useState, useRef, useContext } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SelectBox from "./selectBox";
import { resolveYoutubeId } from "./actions/resolveYoutubeId";
import upload from "./actions/upload";
import { BiPlay, BiPause, BiPlus } from "react-icons/bi";
import { CgRedo } from "react-icons/cg";
import Logo from "../logo";
import ToastContext from "../toast";

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
  const previewIntervalRef = useRef(null);
  const frozenTrack1TimeRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const showToast = useContext(ToastContext);

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
    selectedTracksDispatch({ type: "REMOVE_TRACK", key });
    setPreviewing(false);
    setPlayingKey(null);
  };

  const startPreview = async (position) => {
    if (!(0 in selectedTracks)) return;
    const track = selectedTracks[0].track;
    const videoId = await resolveYoutubeId(
      track.name,
      track.artists?.[0]?.name || ""
    );
    if (!videoId) return;

    // Tell the main player to stop tracking and hand off ownership
    onModalPreviewStart?.();
    ytPlayer?.setOwner?.("modal");

    // Register onEnded to auto-play track 2 when track 1 finishes
    ytPlayer?.setOnEnded(async () => {
      if (!(1 in selectedTracks)) return;
      const track2 = selectedTracks[1].track;
      const track2VideoId = await resolveYoutubeId(
        track2.name,
        track2.artists?.[0]?.name || ""
      );
      if (!track2VideoId) return;
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

  return (
    <div className={"flex flex-col md:pl-4 grow md:w-2/3 " + className}>
      <div className="fixed w-full left-0 top-0 pt-2 px-4 z-20">
        <Logo onClose={onClose} />
      </div>
      <div className="flex flex-col sm:flex-row grow min-h-0 justify-center sm:justify-normal">
        <SelectBox
          track={
            selectedTracks[0]
              ? { ...selectedTracks[0], position: playingKey === 0 ? previewTime : (playingKey === 1 ? frozenTrack1TimeRef.current : selectedTracks[0].position) }
              : undefined
          }
          removeTrack={() => removeTrack(0)}
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
              ? { ...selectedTracks[1], position: playingKey === 1 ? previewTime : selectedTracks[1].position }
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
              selectedTracksDispatch({ type: "POSITION", key: 0, position: selectedTracks[0]?.time || 0 });
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
            await startPreview(selectedTracks[0]?.position || selectedTracks[0]?.time || 0);
          }}
          className="h-14 w-14 rounded-full bg-white text-slate-950 shadow-lg hover:scale-105 transition flex items-center justify-center"
          aria-label={localIsPlaying ? "Pause preview" : "Play preview"}
        >
          {localIsPlaying ? <BiPause size="80%" /> : <BiPlay size="80%" className="translate-x-[2px]" />}
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
