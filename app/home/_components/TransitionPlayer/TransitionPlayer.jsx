import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import getTransitions from "./getTransitions.js";
import Player from "../../../_components/transitionPlayer";
import PlayerSkeleton from "../../../_components/Skeleton";

export default function TransitionPlayer(props) {
  const [transitions, setTransitions] = useState([]);
  const [tracks, setTracks] = useState({});
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const { transitions: newTransitions, tracks: newTracks } =
      await getTransitions(
        transitions.map((transition) => transition.id)
      );
    setTransitions((transitions) => [...transitions, ...newTransitions]);
    setTracks((tracks) => {
      return { ...tracks, ...newTracks };
    });
    return [...transitions, ...newTransitions];
  }

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  if (loading) return <PlayerSkeleton />;

  if (transitions.length < 1)
    return (
      <div className="relative h-full w-full flex flex-col gap-4 place-content-center place-items-center text-white bg-slate-950">
        <p className="text-slate-400">No transitions yet. Upload the first one!</p>
        {props.children}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full"
    >
      <Player
        setTransitions={setTransitions}
        transitions={transitions}
        tracks={tracks}
        loadNewTransitions={fetchData}
        {...props}
      >
        {props.children}
      </Player>
    </motion.div>
  );
}
