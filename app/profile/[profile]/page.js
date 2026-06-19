"use client";

import { useState, useEffect } from "react";
import Profile from "./_components/profile";
import { getTransitions } from "./_actions/getTransitions";
import TransitionPlayer from "../../_components/transitionPlayer.jsx";
import useYouTubePlayer from "../../home/youtubePlayer";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { getProfile } from "./_components/getProfile.js";
import { CgSpinner } from "react-icons/cg";
import Logo from "../../_components/spotifyLogo";

export default function Page({ params }) {
  const [transitions, setTransitions] = useState([]);
  const [tracks, setTracks] = useState({});
  const [startIndex, setStartIndex] = useState(false);
  const router = useRouter();
  const ytPlayer = useYouTubePlayer();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { transitions, tracks } = await getTransitions(params.profile);
      setTransitions(transitions);
      setTracks(tracks);
      setLoading(false);
    }
    async function fetchProfile() {
      const profile = await getProfile(params.profile);
      setProfile(profile);
    }
    fetchData();
    fetchProfile();
  }, [params.profile]);

  if (profile === undefined || loading)
    return (
      <div className="hd-screen w-screen flex place-content-center place-items-center bg-slate-950">
        <CgSpinner size={50} className="animate-spin h-min" />
      </div>
    );

  return (
    <>
      {/* Hidden YouTube IFrame player */}
      <div
        id="yt-player"
        className="fixed bottom-0 left-0 pointer-events-none"
        style={{ width: 1, height: 1, opacity: 0 }}
      />
      <div className="w-full hd-screen bg-slate-950 flex flex-col">
        {typeof startIndex === "number" ? (
          <>
            <TransitionPlayer
              startIndex={startIndex}
              transitions={transitions}
              tracks={tracks}
              ytPlayer={ytPlayer}
              setTransitions={setTransitions}
              explicitWarning={false}
            >
              <button
                onClick={() => {
                  ytPlayer.pause();
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
                ytPlayer.pause();
                router.push("/home");
              }}
              className="absolute h-12 w-12 top-0 left-0 mx-2 my-4 rounded-lg p-2 hover:opacity-50 transition ease-in-out duration-300 text-white"
            >
              <IoMdArrowBack size="100%" />
            </button>
            <div className="w-full flex justify-center mb-6 pt-6">
              {profile && <Profile profile={profile} />}
            </div>
            {transitions.length > 0 ? (
              <div className="grid grid-cols-fluid-mobile sm:grid-cols-fluid gap-4 px-4 pt-4 bg-slate-950">
                {transitions.map((transition, index) => (
                  <button
                    key={transition.id}
                    onClick={() => setStartIndex(index)}
                    className="text-left"
                  >
                    <div className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700 transition">
                      <div className="text-white text-sm font-medium truncate">
                        {tracks[transition.trackid1]?.name}
                      </div>
                      <div className="text-slate-400 text-xs truncate">
                        → {tracks[transition.trackid2]?.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex grow place-self-center items-center">
                <div className="opacity-50 text-xl text-white">
                  No transitions uploaded
                </div>
              </div>
            )}
          </>
        )}
        <div className="fixed z-10 right-0 top-0 my-4">
          <Logo />
        </div>
      </div>
    </>
  );
}
