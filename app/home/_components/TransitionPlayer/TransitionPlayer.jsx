import { useState, useEffect, Suspense } from "react";
import getTransitions from "./getTransitions.js";
import Transition from "./Transition.jsx";
import Player from "../../../_components/transitionPlayer";
import { getUser } from "../profile/action";
import { CgSpinner } from "react-icons/cg";

export default function TransitionPlayer(props) {
  const [transitions, setTransitions] = useState([]);
  const [tracks, setTracks] = useState({});

  async function fetchData() {
    const user = await getUser();
    const { transitions: newTransitions, tracks: newTracks } =
      await getTransitions(
        user.id,
        transitions.map((transition) => transition.id)
      );
    setTransitions((transitions) => [...transitions, ...newTransitions]);
    setTracks((tracks) => {
      return { ...tracks, ...newTracks };
    });
    return [...transitions, ...newTransitions];
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (transitions.length < 1)
    return (
      <div className="h-full w-full flex place-content-center place-items-center">
        <CgSpinner size={50} className="animate-spin h-min " />
      </div>
    );

  return (
    <Player
      setTransitions={setTransitions}
      transitions={transitions}
      tracks={tracks}
      loadNewTransitions={fetchData}
      {...props}
    >
      {props.children}
    </Player>
    // <div className="h-full w-full z-5 flex p-2 justify-center">
    //   <div className="w-full h-full sm:w-1/2 md:w-1/3 grid gap-2 overflow-auto snap-y snap-mandatory scrollbar-hide">
    //     {transitions.map((transition) => {
    //       return (
    //         <Transition
    //           key={transition.id}
    //           transition={transition}
    //           track1={tracks[transition.trackid1]}
    //           track2={tracks[transition.trackid2]}
    //         />
    //       );
    //     })}
    //   </div>
    // </div>
  );
}
