"use client";
import { useEffect, useState, useRef } from "react";
import Upload from "./_components/upload";
import createPlayer from "./spotifyPlayer";
import Profile from "./_components/profile/profile";
import TransitionPlayer from "./_components/TransitionPlayer/TransitionPlayer";
import usePlayer from "./spotifyPlayer";
import { CgSpinner } from "react-icons/cg";

export default function Content() {
  // const [player, setPlayer] = useState({});
  // const [playerState, setPlayerState] = useState({});
  // const [isActive, setActive] = useState(false);
  const player = usePlayer();

  return (
    <>
      <Profile player={player.player} />
      {player.player != null ? (
        <>
          <div className="w-full h-full bg-slate-950 p-4">
            <TransitionPlayer {...player}>
              <Upload {...player} />
            </TransitionPlayer>
          </div>
        </>
      ) : (
        <div className="h-full w-screen flex place-content-center place-items-center bg-slate-950">
          <CgSpinner size={50} className="animate-spin h-min " />
        </div>
      )}
    </>
  );
}
