"use client";
import { useState } from "react";
import Upload from "./_components/upload";
import Logo from "../_components/spotifyLogo";
import Profile from "./_components/profile/profile";
import TransitionPlayer from "./_components/TransitionPlayer/TransitionPlayer";
import useYouTubePlayer from "./youtubePlayer";
import { CgSpinner } from "react-icons/cg";

export default function Content() {
  const ytPlayer = useYouTubePlayer();
  const [explicitWarning, setExplicitWarning] = useState(false);

  return (
    <>
      {/* Hidden YouTube IFrame player — audio only */}
      <div
        id="yt-player"
        className="fixed bottom-0 left-0 pointer-events-none"
        style={{ width: 1, height: 1, opacity: 0 }}
      />
      <div className="flex flex-row absolute z-10 top-0 w-full items-center justify-between">
        <Logo />
        <Profile setExplicitWarning={setExplicitWarning} />
      </div>
      {ytPlayer.ytReady ? (
        <div className="w-full h-full bg-slate-950">
          <TransitionPlayer ytPlayer={ytPlayer} explicitWarning={explicitWarning}>
            <Upload ytPlayer={ytPlayer} />
          </TransitionPlayer>
        </div>
      ) : (
        <div className="h-full w-screen flex place-content-center place-items-center bg-slate-950">
          <CgSpinner size={50} className="animate-spin h-min" />
        </div>
      )}
    </>
  );
}
