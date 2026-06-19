import { useState, useRef } from "react";
import SelectBox from "./selectBox";
import { resolveYoutubeId } from "./actions/resolveYoutubeId";
import upload from "./actions/upload";
import { BiPlay, BiPause, BiPlus } from "react-icons/bi";
import { CgRedo } from "react-icons/cg";
import Logo from "../logo";

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
      <div className="flex flex-col sm:flex-row grow">
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
          active={playingKey === 0}
        />
        <SelectBox
          track={
            selectedTracks[1]
              ? { ...selectedTracks[1], position: playingKey === 1 ? previewTime : selectedTracks[1].position }
              : undefined
          }
          removeTrack={() => removeTrack(1)}
        />
      </div>
      <div className="flex gap-4 w-full justify-evenly place-items-center">
        <button
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
          className="h-10 w-10 rounded-lg hover:opacity-50 transition ease-in-out duration-300 text-white"
        >
          <CgRedo size="100%" />
        </button>
        <button
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
          className="h-12 w-12 rounded-lg hover:opacity-50 transition ease-in-out duration-300 text-white"
        >
          {localIsPlaying ? <BiPause size="100%" /> : <BiPlay size="100%" />}
        </button>
        <button
          onClick={async () => {
            if (Object.keys(selectedTracks).length !== 2) return;
            await upload(
              selectedTracks[0].track,
              selectedTracks[1].track,
              selectedTracks[0].time
            );
            removeTrack(0);
            removeTrack(1);
            onClose();
          }}
          className="h-10 w-10 rounded-lg hover:opacity-50 transition ease-in-out duration-300 text-white"
        >
          <BiPlus size="100%" />
        </button>
      </div>
    </div>
  );
}
