import { useContext } from "react";
import SelectBox from "./selectBox";
import preview from "./actions/preview.js";
import upload from "./actions/upload.js";
import { BiPlay, BiPause, BiPlus } from "react-icons/bi";
import { CgRedo } from "react-icons/cg";
import Image from "next/image";
import Logo from "../logo";
// import ToastContext from "../toast";

export default function TrackPlayer({
  player,
  playerState,
  selectedTracks,
  selectedTracksDispatch,
  setPreviewing,
  previewing,
  device_id,
  onClose,
  className = "",
}) {
  // const toast = useContext(ToastContext);
  const removeTrack = (key) => {
    player.pause();
    selectedTracksDispatch({
      type: "REMOVE_TRACK",
      key: key,
    });
    setPreviewing(false);
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
          active={
            playerState?.track_window?.current_track.id ===
            selectedTracks[0]?.track.id
          }
        />
        <SelectBox
          track={selectedTracks[1]}
          removeTrack={() => removeTrack(1)}
        />
      </div>
      <div className="flex gap-4 w-full justify-evenly place-items-center">
        <button
          onClick={async () => {
            if (!playerState.paused) {
              const tracks = Object.keys(selectedTracks).map(
                (key) => selectedTracks[key].track
              );
              await preview(device_id, tracks, selectedTracks[0].time);
              selectedTracksDispatch({
                type: "POSITION",
                key: 1,
                position: 0,
              });
              return;
            }
            selectedTracksDispatch({
              type: "POSITION",
              key: 0,
              position: selectedTracks[0].time,
            });
            selectedTracksDispatch({
              type: "POSITION",
              key: 1,
              position: 0,
            });
            setPreviewing(false);
          }}
          className="h-10 w-10 rounded-lg hover:opacity-50 transition ease-in-out duration-300 text-white"
          hidden={player?.disabled}
          disabled={player?.disabled}
        >
          <CgRedo size="100%" />
        </button>
        <button
          onClick={async () => {
            if (previewing) return player.togglePlay();
            if (Object.keys(selectedTracks).length === 0) return;
            const tracks = Object.keys(selectedTracks).map(
              (key) => selectedTracks[key].track
            );
            await preview(device_id, tracks, selectedTracks[0].position);
            setPreviewing(true);
          }}
          className="h-12 w-12 rounded-lg hover:opacity-50 transition ease-in-out duration-300 text-white "
          hidden={player?.disabled}
          disabled={player?.disabled}
        >
          {playerState == null || playerState.paused ? (
            <BiPlay size="100%" />
          ) : (
            <BiPause size="100%" />
          )}
        </button>
        <button
          onClick={async () => {
            if (Object.keys(selectedTracks).length != 2) return;
            const result = await upload(
              selectedTracks[0].track.id,
              selectedTracks[1].track.id,
              selectedTracks[0].time,
              ""
            );
            // toast("success", <div>uploaded</div>);
            removeTrack(0);
            removeTrack(1);
          }}
          className="h-10 w-10 rounded-lg hover:opacity-50 transition ease-in-out duration-300 text-white"
        >
          <BiPlus size="100%" />
        </button>
      </div>
      {/* <span className="h-min place-self-center">Start: 4:54</span> */}
    </div>
  );
}
