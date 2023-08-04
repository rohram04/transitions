"use client";
import { useEffect, useState, useRef } from "react";
import Upload from "./_components/upload";
import createPlayer from "./spotifyPlayer";
import Profile from "./_components/profile/profile";
import TransitionPlayer from "./_components/TransitionPlayer/TransitionPlayer";
import usePlayer from "./spotifyPlayer";

export default function Content() {
  // const [player, setPlayer] = useState({});
  // const [playerState, setPlayerState] = useState({});
  // const [isActive, setActive] = useState(false);
  const player = usePlayer();

  return (
    <>
      <Profile player={player.player} />
      {player.player != null && (
        <>
          <div className="w-full h-full bg-slate-950 p-4">
            <TransitionPlayer {...player}>
              <Upload {...player} />
            </TransitionPlayer>
          </div>
        </>
      )}
    </>
  );
}
