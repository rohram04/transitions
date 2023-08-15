"use client";
import { useEffect, useState, useRef } from "react";
import Upload from "./_components/upload";
import createPlayer from "./spotifyPlayer";
import Profile from "./_components/profile/profile";
import TransitionPlayer from "./_components/TransitionPlayer/TransitionPlayer";
import usePlayer from "./spotifyPlayer";
import { CgSpinner } from "react-icons/cg";
import Logo from "../_components/spotifyLogo";

export default function Content() {
  const player = usePlayer();

  return (
    <>
      <div className="flex flex-row absolute z-10 top-0 w-full items-center justify-between">
        <Logo />
        <Profile player={player.player} />
      </div>
      {player.player != null ? (
        <>
          <div className="w-full h-full bg-slate-950">
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
