"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import { CgSpinner } from "react-icons/cg";
import TransitionPlayer from "../../_components/transitionPlayer.jsx";
import useYouTubePlayer from "../../home/youtubePlayer";
import Logo from "../../_components/appLogo";

// TransitionPlayer requires a cloneElement child (the feed passes the upload
// modal). A shared-link view has none, so hand it a no-op.
const Noop = () => null;

export default function TransitionView({ transition, tracks }) {
  const router = useRouter();
  const ytPlayer = useYouTubePlayer();
  // A single-item feed; setTransitions keeps the like toggle optimistic.
  const [transitions, setTransitions] = useState([transition]);

  const goHome = () => {
    ytPlayer.pauseAll();
    router.push("/home");
  };

  return (
    <div className="w-full hd-screen bg-slate-950 flex flex-col">
      <button
        onClick={goHome}
        aria-label="Go to the feed"
        className="fixed z-20 h-12 w-12 top-0 left-0 mx-2 my-4 rounded-lg p-2 text-white hover:opacity-50 transition ease-in-out duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cue"
      >
        <IoMdArrowBack size="100%" />
      </button>

      <div className="fixed z-10 right-0 top-0 my-4">
        <Logo />
      </div>

      {ytPlayer.ytReady ? (
        <TransitionPlayer
          startIndex={0}
          transitions={transitions}
          tracks={tracks}
          ytPlayer={ytPlayer}
          setTransitions={setTransitions}
          explicitWarning={false}
        >
          <Noop />
        </TransitionPlayer>
      ) : (
        <div className="grow flex items-center justify-center">
          <CgSpinner size={50} className="animate-spin text-white" />
        </div>
      )}
    </div>
  );
}
