"use client";

import { useLayoutEffect, useState, useEffect } from "react";
import Profile from "./_components/profile";
import Transition from "./_components/transition.jsx";
import { getTransitions } from "./_actions/getTransitions";
import TransitionPlayer from "../../_components/transitionPlayer.jsx";
import createPlayer from "../../home/spotifyPlayer";
import usePlayer from "../../home/spotifyPlayer";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { getProfile } from "./_components/getProfile.js";
import { CgSpinner } from "react-icons/cg";
import Logo from "../../_components/spotifyLogo";

export default function Page({ params }) {
  const [transitions, setTransitions] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [startIndex, setStartIndex] = useState(false);
  const router = useRouter();
  const { player, playerState, device_id } = usePlayer();
  const [profile, setProfile] = useState();
  // const [player, setPlayer] = useState({});
  // const [playerState, setPlayerState] = useState({});
  // const [active, setActive] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { transitions, tracks } = await getTransitions(params.profile);
      setTransitions(transitions);
      setTracks(tracks);
      // await createPlayer(setPlayer, setPlayerState, setActive);
    }
    async function fetchProfile() {
      const profile = await getProfile(params.profile);
      setProfile(profile);
    }

    fetchData();
    fetchProfile();
  }, [params.profile]);

  if (profile === undefined || transitions.length < 1)
    return (
      <div className="hd-screen w-screen flex place-content-center place-items-center bg-slate-950">
        <CgSpinner size={50} className="animate-spin h-min " />
      </div>
    );

  return (
    <div className="w-full hd-screen p-2 bg-slate-950">
      {typeof startIndex === "number" ? (
        <>
          <TransitionPlayer
            startIndex={startIndex}
            transitions={transitions}
            tracks={tracks}
            player={player}
            playerState={playerState}
            device_id={device_id}
            setTransitions={setTransitions}
          >
            <button
              onClick={() => {
                player.pause();
                setStartIndex(false);
              }}
              className="absolute h-12 w-12 top-0 left-0 mx-2 my-4 hover:opacity-50 transition ease-in-out duration-300 rounded-lg p-2 text-white"
            >
              <IoMdArrowBack size="100%" />
            </button>
          </TransitionPlayer>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              player.disconnect();
              router.push("/home");
            }}
            className="absolute h-12 w-12 top-0 left-0 mx-2 my-4 rounded-lg p-2 hover:opacity-50 transition ease-in-out duration-300 text-white"
          >
            <IoMdArrowBack size="100%" />
          </button>
          <div className="w-full flex justify-center mb-6 mt-6">
            {profile && <Profile profile={profile} />}
          </div>
          {transitions.length > 0 && (
            <div className="grid grid-cols-fluid gap-4 pt-4 bg-slate-950">
              {transitions.map((transition, index) => {
                return (
                  <Transition
                    key={transition.id}
                    onClick={() => {
                      setStartIndex(index);
                    }}
                    transition={transition}
                    tracks={tracks}
                    profile={profile}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      <div className="fixed z-10 right-0 top-0 m-2">
        <Logo />
      </div>
    </div>
  );
}
