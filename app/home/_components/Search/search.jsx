"use client";

import { useEffect, useState, Suspense, useTransition, use } from "react";
import Track from "./track.jsx";
import { search } from "./actions/search.js";
import Image from "next/image";

export default function Search({
  onClick,
  selectDisabled,
  children,
  className = "",
}) {
  const [timer, setTimer] = useState(null);
  const [tracks, setTracks] = useState([]);

  const handleChange = async (event) => {
    clearTimeout(timer);
    const newTimer = setTimeout(async () => {
      if (event.target.value.trim() === "") return setTracks([]);
      const data = await search(event.target.value);
      setTracks(data?.tracks?.items);
    }, 300);
    setTimer(newTimer);
  };

  return (
    <div
      className={
        "md:h-80 w-full h-full overflow-y-scroll snap-y scrollbar-hide " +
        className
      }
    >
      {children}
      <div className="z-10 sticky top-0">
        <input
          onChange={handleChange}
          placeholder="Search"
          className="w-full p-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl outline-none hover:bg-white/10 focus:bg-white/10 focus:border-white/20 text-white placeholder-white/40 transition"
          type="text"
        />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {tracks?.map((track) => {
          return (
            <button
              key={track.id}
              disabled={selectDisabled}
              onClick={() => onClick(track)}
              className="text-left disabled:opacity-50 snap-end"
            >
              <Track track={track} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
