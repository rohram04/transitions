"use client";
import Image from "next/image";
import { useState, useEffect, useRef, cloneElement } from "react";
import { BiPlay, BiPause } from "react-icons/bi";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { like, unlike } from "./like.js";
import { usePalette } from "react-palette";
import { useMediaQuery } from "./mediaMatchHook";
import { FiUser } from "react-icons/fi";
import AuroraBackground from "./AuroraBackground";
import VinylDisc from "./VinylDisc";
import EqualizerBars from "./EqualizerBars";

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
  const reduceMotion = useReducedMotion();

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

  const liked = Number(t.liked) === 1;

  const handleLike = () => {
    if (liked) {
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
  };

  const handlePlayPause = () => {
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
  };

  // Stagger / entrance variants (disabled when reduced motion).
  const cardVariants = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 40, scale: 0.92 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -30, scale: 0.95 },
      };

  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden bg-slate-950">
      <AuroraBackground palette1={track1Color} palette2={track2Color} />

      <div className="relative z-10 flex flex-col w-full h-full p-2 sm:p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTransition}-${t.id}`}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            variants={{
              animate: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
            }}
            className="flex flex-col gap-6 sm:flex-row grow items-center justify-center sm:px-8 pt-10 sm:pt-8"
          >
            <Track
              track={tracks[t.trackid1]}
              progress={track1Progress}
              isActive={playingTrackIndex === 0}
              isPlaying={localPlaying && playingTrackIndex === 0}
              reduceMotion={reduceMotion}
              variants={cardVariants}
            />
            <Track
              track={tracks[t.trackid2]}
              progress={track2Progress}
              isActive={playingTrackIndex === 1}
              isPlaying={localPlaying && playingTrackIndex === 1}
              reduceMotion={reduceMotion}
              variants={cardVariants}
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating glass control dock */}
        <div className="mx-auto mb-2 sm:mb-4 flex w-full max-w-3xl items-center justify-center gap-3 sm:gap-5 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 sm:px-6 sm:py-4 shadow-2xl backdrop-blur-2xl">
          {explicitWarning &&
            (tracks[t.trackid1]?.explicit || tracks[t.trackid2]?.explicit) && (
              <span className="flex-none relative w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-black font-bold text-xs">E</span>
              </span>
            )}

          <div className="flex flex-col items-center">
            <motion.button
              whileTap={reduceMotion ? undefined : { scale: 0.8 }}
              onClick={handleLike}
              aria-label={liked ? "Unlike" : "Like"}
              className="relative h-7 w-7 sm:h-9 sm:w-9 text-white"
            >
              <AnimatePresence mode="wait" initial={false}>
                {liked ? (
                  <motion.span
                    key="filled"
                    initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={reduceMotion ? undefined : { scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <BsSuitHeartFill size="100%" className="text-red-500" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="outline"
                    initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={reduceMotion ? undefined : { scale: 0.8, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <BsSuitHeart size="100%" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <span className="text-xs sm:text-sm font-semibold text-white/80 tabular-nums">
              {t.likes}
            </span>
          </div>

          <motion.button
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            disabled={pathname === `/profile/${t.profile?.id}`}
            onClick={() => router.push(`/profile/${t.profile?.id}`)}
            className="flex items-center gap-2 disabled:opacity-60"
          >
            <span className="flex-none relative w-9 h-9 sm:w-12 sm:h-12 rounded-full ring-2 ring-white/20">
              {t.profile?.avatarurl ? (
                <Image
                  className="object-cover rounded-full"
                  src={t.profile.avatarurl}
                  fill={true}
                  alt={t.profile.display_name || ""}
                />
              ) : (
                <div className="w-full h-full flex items-center place-content-center">
                  <FiUser className="w-full h-full p-2 bg-slate-800 rounded-full" />
                </div>
              )}
            </span>
            <span className="hidden sm:block text-sm md:text-base text-white/90 font-medium max-w-[8rem] truncate">
              {t.profile?.display_name}
            </span>
          </motion.button>

          <motion.button
            whileTap={reduceMotion ? undefined : { scale: 0.85 }}
            onClick={() => setActiveTransition((prev) => prev - 1)}
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full text-white hover:bg-white/10 transition disabled:opacity-30"
            disabled={activeTransition === 0}
            aria-label="Previous transition"
          >
            <MdNavigateBefore size="100%" />
          </motion.button>

          <motion.button
            whileTap={reduceMotion ? undefined : { scale: 0.85 }}
            onClick={handlePlayPause}
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white text-slate-950 shadow-lg hover:scale-105 transition flex items-center justify-center"
            aria-label={localPlaying ? "Pause" : "Play"}
          >
            {localPlaying ? (
              <BiPause size="80%" />
            ) : (
              <BiPlay size="80%" className="translate-x-[2px]" />
            )}
          </motion.button>

          <motion.button
            whileTap={reduceMotion ? undefined : { scale: 0.85 }}
            onClick={async () => {
              if (activeTransition === transitions.length - 2) {
                loadNewTransitions();
              }
              setActiveTransition((prev) => prev + 1);
            }}
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full text-white hover:bg-white/10 transition disabled:opacity-30"
            disabled={activeTransition === transitions.length - 1}
            aria-label="Next transition"
          >
            <MdNavigateNext size="100%" />
          </motion.button>

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
      </div>
    </div>
  );
}

function Track({ track, progress = 0, isActive, isPlaying, reduceMotion, variants }) {
  if (!track) return null;
  let percentage = (progress / (track.duration_ms || 1)) * 100;
  if (percentage > 100) percentage = 100;
  if (percentage < 1) percentage = 0;

  const artUrl = track?.album?.images[0]?.url || "";

  return (
    <motion.div
      layout
      variants={variants}
      transition={{ layout: { duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] } }}
      className="flex flex-col basis-1/2 items-center w-full sm:px-4 gap-4 whitespace-nowrap truncate"
    >
      {/* Active track is a rotating vinyl hero; the other is flat album art */}
      {/* Size by the SMALLER of a rem cap, a viewport-width cap and a viewport-height
          cap. aspect-square makes height follow width, so the vh term guarantees the
          disc never overflows the viewport vertically: tall screens fall back to the
          rem cap (large disc); short/wide screens shrink to fit so the player always
          fills one screen with no scroll. */}
      <motion.div
        layout
        className="relative flex items-center justify-center aspect-square w-[min(18rem,72vw,26vh)] sm:w-[min(20rem,42vw,48vh)] lg:w-[min(24rem,42vw,50vh)] xl:w-[min(30rem,40vw,52vh)] 2xl:w-[min(34rem,40vw,54vh)]"
        animate={
          reduceMotion
            ? undefined
            : { scale: isActive ? 1 : 0.82, opacity: isActive ? 1 : 0.78 }
        }
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        {isActive ? (
          <VinylDisc src={artUrl} alt={track?.album?.name} isSpinning={isPlaying && !reduceMotion} />
        ) : (
          <span className="relative w-[78%] aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              className="object-cover"
              src={artUrl}
              fill={true}
              sizes="(min-width: 1536px) 27rem, (min-width: 1280px) 24rem, (min-width: 1024px) 19rem, (min-width: 640px) 16rem, 10rem"
              alt={track?.album?.name || ""}
            />
          </span>
        )}
      </motion.div>

      <div
        className="text-center max-w-[20rem] text-white group focus:overflow-y-scroll scrollbar-hide"
        tabIndex={0}
      >
        <div className="flex items-center justify-center gap-2">
          {isPlaying && <EqualizerBars isPlaying={isPlaying} />}
          <div className="text-2xl sm:text-xl md:text-2xl lg:text-4xl font-bold tracking-tight whitespace-nowrap truncate group-focus:whitespace-normal">
            {track.name}
          </div>
        </div>
        <div className="lg:text-xl text-white/80 mt-1 whitespace-nowrap truncate group-focus:whitespace-normal">
          {track.album?.artists?.map((artist, index) =>
            index === 0 ? artist.name : ", " + artist.name
          )}
        </div>
        <div className="lg:text-lg text-white/50 whitespace-nowrap truncate group-focus:whitespace-normal">
          {track.album?.name}
        </div>
      </div>

      <div className="w-4/5 sm:w-full max-w-[20rem] h-2 rounded-full bg-white/15 overflow-hidden self-center">
        <div
          className="h-full rounded-full bg-white transition-[width] duration-500 ease-linear"
          style={{ width: percentage + "%" }}
        />
      </div>
    </motion.div>
  );
}
