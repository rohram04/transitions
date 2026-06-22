"use client";

import { useState, useEffect } from "react";
import Profile from "./_components/profile";
import Transition from "./_components/transition.jsx";
import { getTransitions } from "./_actions/getTransitions";
import { deleteTransition } from "./_actions/deleteTransition";
import TransitionPlayer from "../../_components/transitionPlayer.jsx";
import useYouTubePlayer from "../../home/youtubePlayer";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { getProfile } from "./_components/getProfile.js";
import { getUser } from "@/app/home/_components/profile/action";
import { CgSpinner } from "react-icons/cg";
import Logo from "../../_components/appLogo";

// No-op placeholder for TransitionPlayer's required cloneElement child (the
// profile view has no upload modal; the back button lives at the page level).
const Noop = () => null;

export default function Page({ params }) {
  const [transitions, setTransitions] = useState([]);
  const [tracks, setTracks] = useState({});
  const [startIndex, setStartIndex] = useState(false);
  const router = useRouter();
  const ytPlayer = useYouTubePlayer();
  const [profile, setProfile] = useState();
  const [user, setUser] = useState(null);
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
    async function fetchUser() {
      setUser(await getUser());
    }
    fetchData();
    fetchProfile();
    fetchUser();
  }, [params.profile]);

  // Viewing your own profile => you may delete your transitions.
  const canDelete =
    user?.id != null && String(user.id) === String(params.profile);

  const handleDelete = async (id) => {
    const res = await deleteTransition(id);
    if (res?.ok) {
      setTransitions((prev) => prev.filter((t) => t.id !== id));
    }
    return res;
  };

  const handleBack = () => {
    ytPlayer.pauseAll();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/home");
    }
  };

  const ready = profile !== undefined && !loading;

  return (
    <>
      {!ready ? (
        <div className="hd-screen w-screen flex place-content-center place-items-center bg-slate-950">
          <CgSpinner size={50} className="animate-spin h-min text-white" />
        </div>
      ) : (
        <div className="w-full hd-screen bg-slate-950 flex flex-col">
          {typeof startIndex === "number" ? (
            <>
              {ytPlayer.ytReady ? (
                <>
                  {/* Back button at the page top-left, consistent with the grid
                      view. Rendered here (not as TransitionPlayer children) so it
                      isn't trapped inside the control dock's backdrop-blur
                      containing block. */}
                  <button
                    onClick={() => {
                      ytPlayer.pauseAll();
                      setStartIndex(false);
                    }}
                    className="fixed z-20 h-12 w-12 top-0 left-0 mx-2 my-4 hover:opacity-50 transition ease-in-out duration-300 rounded-lg p-2 text-white"
                  >
                    <IoMdArrowBack size="100%" />
                  </button>
                  <TransitionPlayer
                    startIndex={startIndex}
                    transitions={transitions}
                    tracks={tracks}
                    ytPlayer={ytPlayer}
                    setTransitions={setTransitions}
                    explicitWarning={false}
                  >
                    <Noop />
                  </TransitionPlayer>
                </>
              ) : (
                <div className="grow flex items-center justify-center">
                  <CgSpinner size={50} className="animate-spin text-white" />
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="absolute h-12 w-12 top-0 left-0 mx-2 my-4 rounded-lg p-2 hover:opacity-50 transition ease-in-out duration-300 text-white"
              >
                <IoMdArrowBack size="100%" />
              </button>
              <div className="w-full flex justify-center mb-6 pt-6">
                {profile && <Profile profile={profile} />}
              </div>
              {transitions.length > 0 ? (
                <div className="grid grid-cols-fluid-mobile sm:grid-cols-fluid gap-4 px-4 pt-4 pb-8 bg-slate-950">
                  {transitions.map((transition, index) => (
                    <Transition
                      key={transition.id}
                      transition={transition}
                      tracks={tracks}
                      onClick={() => setStartIndex(index)}
                      canDelete={canDelete}
                      onDelete={handleDelete}
                    />
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
      )}
    </>
  );
}
