"use client";
import { useState } from "react";
import Upload from "./_components/upload";
import Logo from "../_components/spotifyLogo";
import Profile from "./_components/profile/profile";
import TransitionPlayer from "./_components/TransitionPlayer/TransitionPlayer";
import useYouTubePlayer from "./youtubePlayer";
import { motion, AnimatePresence } from "framer-motion";
import PlayerSkeleton from "../_components/Skeleton";
import { ToastContextProvider } from "./_components/toast";

export default function Content() {
  const ytPlayer = useYouTubePlayer();
  const [explicitWarning, setExplicitWarning] = useState(false);

  return (
    <ToastContextProvider>
      <div className="flex flex-row absolute z-50 top-0 w-full items-center justify-between">
        <Logo />
        <Profile setExplicitWarning={setExplicitWarning} />
      </div>
      <AnimatePresence mode="wait">
        {ytPlayer.ytReady ? (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full bg-slate-950"
          >
            <TransitionPlayer ytPlayer={ytPlayer} explicitWarning={explicitWarning}>
              <Upload ytPlayer={ytPlayer} />
            </TransitionPlayer>
          </motion.div>
        ) : (
          <motion.div
            key="skeleton"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <PlayerSkeleton />
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContextProvider>
  );
}
