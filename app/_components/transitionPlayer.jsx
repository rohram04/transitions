import Image from "next/image";
import { useState, useEffect, useRef, cloneElement } from "react";
import { BiPlay, BiPause } from "react-icons/bi";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import { like, unlike } from "./like.js";
import { usePalette } from "react-palette";
import { useMediaQuery } from "./mediaMatchHook";
import { FiUser } from "react-icons/fi";
import Footer from "./spotifyFooter";

export default function TransitionPlayer({
  transitions,
  tracks,
  ytPlayer,
  startIndex = 0,
  children,
  setTransitions,
  explicitWarning,
  loadNewTransitions = () => {},
}) {
  const [activeTransition, setActiveTransition] = useState(startIndex);
  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const [localPlaying, setLocalPlaying] = useState(false);
  const [trackTime, setTrackTime] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const activeTransitionRef = useRef(activeTransition);
  const playingTrackIndexRef = useRef(playingTrackIndex);
  const transitionsRef = useRef(transitions);
  const ytPlayerRef = useRef(ytPlayer);
  const trackTimeIntervalRef = useRef(null);

  useEffect(() => { activeTransitionRef.current = activeTransition; }, [activeTransition]);
  useEffect(() => { playingTrackIndexRef.current = playingTrackIndex; }, [playingTrackIndex]);
  useEffect(() => { transitionsRef.current = transitions; }, [transitions]);
  useEffect(() => { ytPlayerRef.current = ytPlayer; }, [ytPlayer]);

  const stopTimeTracking = () => {
    clearInterval(trackTimeIntervalRef.current);
    trackTimeIntervalRef.current = null;
  };

  const startTimeTracking = (startMs = 0) => {
    stopTimeTracking();
    setTrackTime(startMs);
    trackTimeIntervalRef.current = setInterval(() => {
      const player = ytPlayerRef.current;
      if (player?.getOwner() === "main") {
        setTrackTime(player.getTime());
      }
    }, 500);
  };

  // Re-register onEnded each time we take ownership of the player.
  const registerOnEnded = () => {
    ytPlayerRef.current?.setOnEnded(() => {
      const player = ytPlayerRef.current;
      const tr = transitionsRef.current[activeTransitionRef.current];
      if (playingTrackIndexRef.current === 0 && tr?.youtubevideoid2) {
        player.play(tr.youtubevideoid2, 0);
        playingTrackIndexRef.current = 1;
        setPlayingTrackIndex(1);
        setTrackTime(0);
      } else {
        stopTimeTracking();
        setLocalPlaying(false);
        setPlayingTrackIndex(null);
        if (activeTransitionRef.current < transitionsRef.current.length - 1) {
          setActiveTransition((prev) => prev + 1);
        }
      }
    });
  };

  // Auto-play track 1 whenever active transition changes.
  useEffect(() => {
    if (!ytPlayer?.play) return;
    const tr = transitions[activeTransition];
    if (tr?.youtubevideoid1) {
      ytPlayer.setOwner("main");
      registerOnEnded();
      ytPlayer.play(tr.youtubevideoid1, (tr.starttime || 0) / 1000);
      playingTrackIndexRef.current = 0;
      setPlayingTrackIndex(0);
      setLocalPlaying(true);
      startTimeTracking(tr.starttime || 0);
    }
  }, [activeTransition]);

  useEffect(() => {
    return () => stopTimeTracking();
  }, []);

  const t = transitions[activeTransition];
  const { data: track1Color } = usePalette(tracks[t.trackid1]?.album?.images[0]?.url || "");
  const { data: track2Color } = usePalette(tracks[t.trackid2]?.album?.images[0]?.url || "");
  const sm = useMediaQuery("(min-width: 640px)");

  const track1Progress =
    playingTrackIndex === 0 ? trackTime : tracks[t.trackid1]?.duration_ms ?? 0;
  const track2Progress =
    playingTrackIndex === 1 ? trackTime : 0;

  return (
    <div
      className="flex flex-col w-full h-full p-2"
      style={{
        backgroundImage: sm
          ? `linear-gradient(to right, ${track1Color?.darkMuted || "#1e293b"}, ${track2Color?.darkMuted || "#1e293b"})`
          : `linear-gradient(${track1Color?.darkMuted || "#1e293b"}, ${track2Color?.darkMuted || "#1e293b"})`,
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row grow sm:px-8 pt-8">
        <Track track={tracks[t.trackid1]} progress={track1Progress} />
        <Track track={tracks[t.trackid2]} progress={track2Progress} />
      </div>

      <div className="flex items-center mx-2 sm:mx-4 sm:mt-4 sm:gap-4 justify-center">
        {explicitWarning &&
          (tracks[t.trackid1]?.explicit || tracks[t.trackid2]?.explicit) && (
            <span className="flex-none relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-black font-bold text-xs">E</span>
            </span>
          )}
        <div className="flex flex-col sm:flex-row sm:gap-2 items-center mr-2 sm:mr-0">
          <div className="sm:text-lg order-last sm:order-first text-white">
            {t.likes}
          </div>
          <button
            onClick={() => {
              if (Number(t.liked) === 1) {
                setTransitions((prev) => {
                  let copy = [...prev];
                  copy[activeTransition].liked = 0;
                  copy[activeTransition].likes = String(Number(copy[activeTransition].likes) - 1);
                  return copy;
                });
                return unlike(t.id);
              }
              setTransitions((prev) => {
                let copy = [...prev];
                copy[activeTransition].liked = 1;
                copy[activeTransition].likes = String(Number(copy[activeTransition].likes) + 1);
                return copy;
              });
              return like(t.id);
            }}
            className="h-8 w-8 sm:h-10 sm:w-10 text-white"
          >
            {Number(t.liked) === 0 ? (
              <BsSuitHeart size="100%" />
            ) : (
              <BsSuitHeartFill size="100%" className="text-red-500" />
            )}
          </button>
        </div>
        <button
          disabled={pathname === `/profile/${t.profile?.id}`}
          onClick={() => router.push(`/profile/${t.profile?.id}`)}
          className="flex items-center"
        >
          <span className="flex-none relative w-10 h-10 sm:w-16 sm:h-16 rounded-full">
            {t.profile?.avatarurl ? (
              <Image
                className="object-contain rounded-full"
                src={t.profile.avatarurl}
                fill={true}
                alt={t.profile.display_name || ""}
              />
            ) : (
              <div className="w-full h-full flex items-center place-content-center">
                <FiUser className="w-full h-full p-2 sm:p-4 bg-slate-800 rounded-full" />
              </div>
            )}
          </span>
          <div className="sm:text-xl ml-2 text-white">{t.profile?.display_name}</div>
        </button>
        <button
          onClick={() => setActiveTransition((prev) => prev - 1)}
          className="h-14 w-20 sm:w-16 sm:h-14 rounded-lg hover:opacity-50 transition ease-in-out duration-300 disabled:opacity-30 text-white"
          disabled={activeTransition === 0}
        >
          <MdNavigateBefore size="100%" />
        </button>
        <button
          onClick={() => {
            if (!ytPlayer) return;
            if (localPlaying) {
              ytPlayer.pause();
              stopTimeTracking();
              setLocalPlaying(false);
            } else {
              const tr = transitions[activeTransition];
              if (tr?.youtubevideoid1) {
                ytPlayer.setOwner("main");
                registerOnEnded();
                ytPlayer.play(tr.youtubevideoid1, (tr.starttime || 0) / 1000);
                playingTrackIndexRef.current = 0;
                setPlayingTrackIndex(0);
                setLocalPlaying(true);
                startTimeTracking(tr.starttime || 0);
              }
            }
          }}
          className="h-14 w-20 sm:w-16 sm:h-14 rounded-lg hover:opacity-50 transition ease-in-out duration-300 text-white"
        >
          {localPlaying ? <BiPause size="100%" /> : <BiPlay size="100%" />}
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
        {/* Pass ownership callbacks into the upload modal */}
        {cloneElement(children, {
          onModalPreviewStart: () => {
            stopTimeTracking();
            setLocalPlaying(false);
          },
          onModalPreviewEnd: () => {
            ytPlayer?.setOwner(null);
            ytPlayer?.setOnEnded(null);
          },
        })}
      </div>
      <Footer />
    </div>
  );
}

function Track({ track, progress = 0 }) {
  if (!track) return null;
  let percentage = (progress / (track.duration_ms || 1)) * 100;
  if (percentage > 100) percentage = 100;
  if (percentage < 1) percentage = 0;

  return (
    <div className="flex flex-col basis-1/2 w-full sm:px-4 gap-2 whitespace-nowrap truncate">
      <span className="flex-none relative grow">
        <Image
          className="object-contain"
          src={track?.album?.images[0]?.url || ""}
          fill={true}
          alt={track?.album?.name || ""}
        />
      </span>
      <div
        className="text-center py-1 sm:py-4 text-white group focus:overflow-y-scroll scrollbar-hide"
        tabIndex={0}
      >
        <div className="text-xl sm:text-base md:text-xl lg:text-3xl sm:mb-1 whitespace-nowrap truncate group-focus:overflow-none group-focus:whitespace-normal">
          {track.name}
        </div>
        <div className="lg:text-xl sm:mb-1 whitespace-nowrap truncate group-focus:overflow-none group-focus:whitespace-normal">
          {track.album?.artists?.map((artist, index) =>
            index === 0 ? artist.name : ", " + artist.name
          )}
        </div>
        <div className="lg:text-xl sm:mb-1 whitespace-nowrap truncate group-focus:overflow-none group-focus:whitespace-normal">
          {track.album?.name}
        </div>
      </div>
      <div className="sm:w-full w-4/5 h-2.5 sm:h-4 rounded-full bg-slate-600 mb-2 self-center">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: percentage + "%" }}
        />
      </div>
    </div>
  );
}
