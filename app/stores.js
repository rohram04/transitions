import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useState, useEffect } from "react";

const usePlayerStore = create(
  persist(
    (set, get) => ({
      player: null,
      playerState: null,
      device_id: null,
      setPlayer: (player) =>
        set(() => {
          if (get().player != null) return;
          return { player };
        }),
      setDeviceId: (device_id) =>
        set(() => {
          return { device_id };
        }),
      setPlayerState: (playerState) =>
        set(() => {
          console.log(playerState);
          return { playerState };
        }),
    }),
    {
      name: "player-storage",
    }
  )
);

const useStore = (store, callback) => {
  console.log("STORING");
  const result = store(callback);
  const [data, setData] = useState();

  useEffect(() => {
    console.log(result);
    setData(result);
  }, [result]);

  return data;
};

export { useStore, usePlayerStore };
