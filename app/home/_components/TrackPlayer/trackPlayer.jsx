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
  className = "",
}) {
  const removeTrack = (key) => {
    ytPlayer?.pause();
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
    ytPlayer?.play(videoId, position / 1000);
    setPlayingKey(0);
    setPreviewing(true);
  };

  return (
    <div className={"flex flex-col md:pl-4 grow md:w-2/3 " + className}>
      <div className="fixed w-full left-0 top-0 pt-2 px-4 z-20">
        <Logo onClose={onClose} />
      </div>
      <div className="flex flex-col sm:flex-row grow">
        <SelectBox
          track={selectedTracks[0]}
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
          track={selectedTracks[1]}
          removeTrack={() => removeTrack(1)}
        />
      </div>
      <div className="flex gap-4 w-full justify-evenly place-items-center">
        <button
          onClick={async () => {
            if (ytPlayer?.isPlaying) {
              // Restart from beginning of transition
              await startPreview(selectedTracks[0]?.time || 0);
            } else {
              selectedTracksDispatch({ type: "POSITION", key: 0, position: selectedTracks[0]?.time || 0 });
              selectedTracksDispatch({ type: "POSITION", key: 1, position: 0 });
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
            if (previewing && ytPlayer?.isPlaying) {
              ytPlayer.pause();
              return;
            }
            if (previewing && !ytPlayer?.isPlaying) {
              ytPlayer?.resume();
              return;
            }
            await startPreview(selectedTracks[0]?.position || selectedTracks[0]?.time || 0);
          }}
          className="h-12 w-12 rounded-lg hover:opacity-50 transition ease-in-out duration-300 text-white"
        >
          {ytPlayer?.isPlaying ? <BiPause size="100%" /> : <BiPlay size="100%" />}
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
