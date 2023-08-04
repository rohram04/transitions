import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { BiPlay, BiPause } from "react-icons/bi";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import preview from "app/home/_components/TrackPlayer/actions/preview.js";
import { useRouter, usePathname } from "next/navigation";
import { like, unlike } from "./like.js";

export default function TransitionPlayer({
  transitions,
  tracks,
  player,
  device_id,
  playerState,
  startIndex = 0,
  children,
  setTransitions,
  loadNewTransitions = () => {},
}) {
  // const [player, playerState, device_id] = useStore((state) => [state.player, state.playerState, state.device_id])
  const [activeTransition, setActiveTransition] = useState(startIndex);
  const intervalRef = useRef();
  const [positions, setPositions] = useState({});
  const positionsRef = useRef();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    clearInterval(intervalRef.current);
    setPositions({});
  }, [activeTransition]);

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    preview(
      device_id,
      [
        tracks[transitions[activeTransition].trackid1],
        tracks[transitions[activeTransition].trackid2],
      ],
      transitions[activeTransition].starttime
    );
  }, [activeTransition, device_id]);

  useEffect(() => {
    if (!player) return;
    const positionControl = (state) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const current_track = state.track_window.current_track;
      setPositions((prev) => {
        return {
          ...prev,
          [current_track.id]: state.position,
        };
      });
      if (state.paused) return;
      intervalRef.current = setInterval(() => {
        if (positionsRef.current[current_track.id] >= current_track.duration_ms)
          return clearInterval(intervalRef.current);
        setPositions((prev) => {
          return { ...prev, [current_track.id]: prev[current_track.id] + 1000 };
        });
      }, 1000);
    };

    player.addListener("player_state_changed", positionControl);
  }, [player]);

  useEffect(() => {
    if (activeTransition === transitions.length - 1) return;
    if (
      playerState?.track_window?.previous_tracks.length > 0 &&
      playerState?.track_window?.previous_tracks[0].id ==
        transitions[activeTransition].trackid2
    ) {
      setActiveTransition((prev) => prev + 1);
    }
  }, [playerState]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4 sm:flex-row grow px-8 pt-8">
        <Track
          track={tracks[transitions[activeTransition].trackid1]}
          progress={positions[transitions[activeTransition].trackid1]}
        />
        <Track
          track={tracks[transitions[activeTransition].trackid2]}
          progress={positions[transitions[activeTransition].trackid2]}
        />
      </div>

      <div className="flex items-center mx-2 sm:m-4 sm:gap-4 justify-center">
        <div className="flex flex-col sm:flex-row sm:gap-2 items-center mr-2 sm:mr-0">
          <div className="sm:text-lg order-last sm:order-first">
            {transitions[activeTransition].likes}
          </div>
          <button
            onClick={() => {
              if (transitions[activeTransition].liked === "1") {
                setTransitions((prev) => {
                  let copy = [...prev];
                  copy[activeTransition].liked = "0";
                  copy[activeTransition].likes = String(
                    Number(copy[activeTransition].likes) - 1
                  );
                  return copy;
                });
                return unlike(
                  transitions[activeTransition].profile.id,
                  transitions[activeTransition].id
                );
              }
              setTransitions((prev) => {
                let copy = [...prev];
                copy[activeTransition].liked = "1";
                copy[activeTransition].likes = String(
                  Number(copy[activeTransition].likes) + 1
                );
                return copy;
              });
              return like(
                transitions[activeTransition].profile.id,
                transitions[activeTransition].id
              );
            }}
            className="h-10"
          >
            {transitions[activeTransition].liked === "0" ? (
              <BsSuitHeart size="auto" />
            ) : (
              <BsSuitHeartFill size="auto" className="text-red-500" />
            )}
          </button>
        </div>
        <button
          disabled={
            pathname === `/profile/${transitions[activeTransition].profile.id}`
          }
          onClick={async () => {
            await player.disconnect();
            router.push(`/profile/${transitions[activeTransition].profile.id}`);
          }}
          className="flex items-center"
        >
          <span className="flex-none relative w-10 h-10 sm:w-16 sm:h-16 rounded-full">
            <Image
              className="object-contain rounded-full"
              src={transitions[activeTransition].profile?.images[1]?.url}
              fill={true}
              alt={transitions[activeTransition].profile?.display_name}
            />
          </span>
          <div className="sm:text-xl ml-2">
            {transitions[activeTransition].profile?.display_name}
          </div>
        </button>
        <button
          onClick={() => {
            setActiveTransition((prev) => prev - 1);
          }}
          className="h-20 sm:h-16 rounded-lg hover:opacity-50 transition ease-in-out duration-300 disabled:opacity-30"
          disabled={activeTransition === 0}
        >
          <MdNavigateBefore size="auto" />
        </button>
        <button
          onClick={() => {
            if (playerState?.track_window.current_track)
              return player.togglePlay();
            preview(
              device_id,
              [
                tracks[transitions[activeTransition].trackid1],
                tracks[transitions[activeTransition].trackid2],
              ],
              transitions[activeTransition].starttime
            );
          }}
          className="h-20 sm:h-16 rounded-lg hover:opacity-50 transition ease-in-out duration-300"
        >
          {playerState == null || playerState.paused ? (
            <BiPlay size="auto" />
          ) : (
            <BiPause size="auto" />
          )}
        </button>
        <button
          onClick={async () => {
            if (activeTransition === transitions.length - 2) {
              loadNewTransitions();
            }
            setActiveTransition((prev) => prev + 1);
          }}
          className="h-20 sm:h-16 rounded-lg hover:opacity-50 transition ease-in-out duration-300 disabled:opacity-30"
          disabled={activeTransition === transitions.length - 1}
        >
          <MdNavigateNext size="auto" />
        </button>
        {children}
      </div>
    </div>
  );
}

function Track({ track, progress = 0 }) {
  let percentage = (progress / track.duration_ms) * 100;
  if (percentage < 1) percentage = 0;
  //   if (percentage > 99) percentage = 100;

  return (
    <div className="flex flex-col basis-1/2 w-full px-4 gap-2">
      <span class="flex-none relative grow">
        <Image
          className="object-contain max-h-min"
          src={track?.album?.images[0].url}
          fill={true}
          alt={track?.album?.name}
        />
      </span>
      <div className="text-center p-1 sm:p-4">
        <div className="text-xl sm:text-4xl mb-1">{track.name}</div>
        <div className="sm:text-xl">
          {track.album.artists.map((artist, index) => {
            return index == 0 ? artist.name : ", " + artist.name;
          })}
        </div>
      </div>

      <div className="w-full h-2.5 sm:h-4 rounded-full bg-slate-600 mb-2">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: percentage + "%" }}
        ></div>
      </div>
    </div>
  );
}
