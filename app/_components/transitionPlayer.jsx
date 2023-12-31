import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { BiPlay, BiPause } from "react-icons/bi";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import preview from "app/home/_components/TrackPlayer/actions/preview.js";
import { useRouter, usePathname } from "next/navigation";
import { like, unlike } from "./like.js";
import { usePalette } from "react-palette";
import { useMediaQuery } from "./mediaMatchHook";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import Footer from "./spotifyFooter";

export default function TransitionPlayer({
  transitions,
  tracks,
  player,
  device_id,
  playerState,
  startIndex = 0,
  children,
  setTransitions,
  explicitWarning,
  loadNewTransitions = () => {},
}) {
  // const [player, playerState, device_id] = useStore((state) => [state.player, state.playerState, state.device_id])
  const [activeTransition, setActiveTransition] = useState(startIndex);
  const intervalRef = useRef();
  const [positions, setPositions] = useState({});
  const positionsRef = useRef();
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: track1Color,
    loading,
    error,
  } = usePalette(
    tracks[transitions[activeTransition].trackid1].album?.images[0].url
  );
  const { data: track2Color } = usePalette(
    tracks[transitions[activeTransition].trackid2].album?.images[0].url
  );
  const sm = useMediaQuery("(min-width: 640px)");

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
    <div
      className="flex flex-col w-full h-full p-2"
      style={{
        backgroundImage: sm
          ? `linear-gradient(to right, ${track1Color.darkMuted}, ${track2Color.darkMuted})`
          : `linear-gradient(${track1Color.darkMuted}, ${track2Color.darkMuted})`,
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row grow sm:px-8 pt-8">
        <Track
          track={tracks[transitions[activeTransition].trackid1]}
          progress={positions[transitions[activeTransition].trackid1]}
        />
        <Track
          track={tracks[transitions[activeTransition].trackid2]}
          progress={positions[transitions[activeTransition].trackid2]}
        />
      </div>

      <div className="flex items-center mx-2 sm:mx-4 sm:mt-4 sm:gap-4 justify-center">
        {explicitWarning &&
          (tracks[transitions[activeTransition].trackid1].explicit ||
            tracks[transitions[activeTransition].trackid2].explicit) && (
            <span className="flex-none relative w-8 h-8 sm:w-10 sm:h-10 rounded-full">
              <Image
                className="object-contain rounded-full"
                src={"/spotify-icons-logos/19badge-dark.png"}
                fill={true}
                alt={"explicit warning"}
              />
            </span>
          )}
        <div className="flex flex-col sm:flex-row sm:gap-2 items-center mr-2 sm:mr-0">
          <div className="sm:text-lg order-last sm:order-first text-white">
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
                return unlike(transitions[activeTransition].id);
              }
              setTransitions((prev) => {
                let copy = [...prev];
                copy[activeTransition].liked = "1";
                copy[activeTransition].likes = String(
                  Number(copy[activeTransition].likes) + 1
                );
                return copy;
              });
              return like(transitions[activeTransition].id);
            }}
            className="h-8 w-8 sm:h-10 sm:w-10 text-white"
          >
            {transitions[activeTransition].liked === "0" ? (
              <BsSuitHeart size="100%" />
            ) : (
              <BsSuitHeartFill size="100%" className="text-red-500" />
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
            {transitions[activeTransition].profile?.images.length > 0 ? (
              <Image
                className="object-contain rounded-full"
                src={transitions[activeTransition].profile?.images[1]?.url}
                fill={true}
                alt={transitions[activeTransition].profile?.display_name}
              />
            ) : (
              <div className="w-full h-full flex items-center place-content-center">
                <FiUser className="w-full h-full  p-2 sm:p-4 bg-slate-800 rounded-full" />
              </div>
            )}
          </span>
          <div className="sm:text-xl ml-2 text-white">
            {transitions[activeTransition].profile?.display_name}
          </div>
        </button>
        <button
          onClick={() => {
            setActiveTransition((prev) => prev - 1);
          }}
          className="h-14 w-20 sm:w-16 sm:h-14 rounded-lg hover:opacity-50 transition ease-in-out duration-300 disabled:opacity-30 text-white"
          disabled={activeTransition === 0}
        >
          <MdNavigateBefore size="100%" />
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
          className="h-14 w-20 sm:w-16 sm:h-14 rounded-lg hover:opacity-50 transition ease-in-out duration-300 text-white "
          hidden={player.disabled}
          disabled={player.disabled}
        >
          {playerState == null || playerState.paused ? (
            <BiPlay size="100%" />
          ) : (
            <BiPause size="100%" />
          )}
        </button>
        <button
          onClick={async () => {
            if (activeTransition === transitions.length - 2) {
              loadNewTransitions();
            }
            setActiveTransition((prev) => prev + 1);
          }}
          className="h-14 w-20 sm:w-16 sm:h-14 rounded-lg hover:opacity-50 transition ease-in-out duration-300 disabled:opacity-30 text-white"
          disabled={activeTransition === transitions.length - 1}
        >
          <MdNavigateNext size="100%" />
        </button>
        {children}
      </div>
      <Footer
        href={
          playerState
            ? playerState.track_window.current_track.uri
            : tracks[transitions[activeTransition].trackid1].uri
        }
      />
    </div>
  );
}

function Track({ track, progress = 0 }) {
  let percentage = (progress / track.duration_ms) * 100;
  if (percentage < 1) percentage = 0;

  return (
    <div className="flex flex-col basis-1/2 w-full sm:px-4 gap-2 whitespace-nowrap truncate">
      <span class="flex-none relative grow">
        <Image
          className="object-contain"
          src={track?.album?.images[0].url}
          fill={true}
          alt={track?.album?.name}
        />
      </span>
      <div
        className="text-center py-1 sm:py-4 text-white group focus:overflow-y-scroll scrollbar-hide "
        tabIndex={0}
      >
        <div className="text-xl sm:text-base md:text-xl lg:text-3xl sm:mb-1 whitespace-nowrap truncate group-focus:overflow-none group-focus:whitespace-normal">
          {track.name}
        </div>
        <div className="lg:text-xl sm:mb-1 whitespace-nowrap truncate group-focus:overflow-none group-focus:whitespace-normal">
          {track.album.artists.map((artist, index) => {
            return index == 0 ? artist.name : ", " + artist.name;
          })}
        </div>
        <div className="lg:text-xl sm:mb-1 whitespace-nowrap truncate group-focus:overflow-none group-focus:whitespace-normal">
          {track.album.name}
        </div>
      </div>

      <div className="sm:w-full w-4/5 h-2.5 sm:h-4 rounded-full bg-slate-600 mb-2 self-center">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: percentage + "%" }}
        ></div>
      </div>
    </div>
  );
}
