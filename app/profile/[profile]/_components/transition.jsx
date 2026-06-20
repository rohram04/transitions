"use client";
import Image from "next/image";
import { useState } from "react";
import { BsFillPlayFill, BsSuitHeartFill, BsSuitHeart } from "react-icons/bs";
import { FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

export default function Transition({
  transition,
  tracks,
  onClick,
  canDelete = false,
  onDelete,
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const track1 = tracks[transition.trackid1];
  const track2 = tracks[transition.trackid2];
  if (!track1 || !track2) return null;

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await onDelete?.(transition.id);
    } finally {
      // On success the parent removes this card; if it fails we reset.
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-white/5 border border-white/10 backdrop-blur-xl transition ease-in-out duration-300 hover:bg-white/10 rounded-2xl p-2 cursor-pointer"
    >
      {canDelete && (
        <div
          className="absolute top-2 right-2 z-10 flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {deleting ? (
            <span className="h-8 w-8 flex items-center justify-center text-white">
              <CgSpinner className="animate-spin" size="60%" />
            </span>
          ) : confirming ? (
            <>
              <button
                aria-label="Confirm delete"
                onClick={handleDelete}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-500 transition"
              >
                <FiCheck size="55%" />
              </button>
              <button
                aria-label="Cancel delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirming(false);
                }}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition"
              >
                <FiX size="55%" />
              </button>
            </>
          ) : (
            <button
              aria-label="Delete transition"
              onClick={(e) => {
                e.stopPropagation();
                setConfirming(true);
              }}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white/80 hover:bg-red-500/80 hover:text-white transition"
            >
              <FiTrash2 size="50%" />
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row w-full gap-2">
        <Track
          percentage={(transition.starttime / (track1.duration_ms || 1)) * 100}
          track={track1}
        />
        <Track percentage={0} track={track2} />
      </div>
      <div className="group grid grid-cols-3 h-8 w-full px-2 gap-2 text-white grow mt-2 sm:mt-0">
        <span className="invisible"></span>
        <span className="flex justify-self-center transition ease-in-out duration-300 group-hover:opacity-50 cursor-pointer">
          <BsFillPlayFill size="100%" className="w-8" />
        </span>
        <span className="flex items-center gap-1 justify-self-end">
          <span>{transition.likes}</span>
          {String(transition.liked) === "0" ? (
            <BsSuitHeart size="100%" className="p-1 w-8" />
          ) : (
            <BsSuitHeartFill size="100%" className="text-red-500 p-1 w-8" />
          )}
        </span>
      </div>
    </div>
  );
}

function Track({ track, percentage }) {
  const artUrl = track?.album?.images?.[0]?.url || "";
  const artists =
    track?.album?.artists?.map((artist, index) =>
      index === 0 ? artist.name : ", " + artist.name
    ) || "";

  return (
    <>
      {/* Mobile: horizontal row */}
      <div className="sm:hidden bg-white/5 rounded-lg">
        <div className="flex w-full h-full place-items-center">
          <span className="flex-none w-20 h-20 relative">
            {artUrl && (
              <Image
                className="object-contain rounded-lg max-w-fit p-2"
                src={artUrl}
                fill={true}
                sizes="80px"
                alt={track?.album?.name || ""}
              />
            )}
          </span>
          <span className="flex flex-col flex-initial py-2 min-w-0">
            <div className="truncate text-sm text-white">{track.name}</div>
            <div className="truncate text-xs text-white/70">{artists}</div>
            <div className="truncate text-xs text-white/50">
              {track.album?.name}
            </div>
          </span>
        </div>
        <div className="w-full h-1.5 rounded-b-lg overflow-hidden bg-white/15">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: percentage + "%" }}
          ></div>
        </div>
      </div>

      {/* Desktop: vertical card */}
      <div className="flex-col w-full h-60 px-2 overflow-hidden hidden sm:flex rounded-lg p-4">
        <span className="flex-none relative grow">
          {artUrl && (
            <Image
              className="object-contain"
              src={artUrl}
              fill={true}
              sizes="(min-width: 640px) 14rem, 10rem"
              alt={track?.album?.name || ""}
            />
          )}
        </span>
        <div className="text-center text-white">
          <div className="whitespace-nowrap truncate text-sm">{track.name}</div>
          <div className="text-xs text-white/70 whitespace-nowrap truncate">
            {artists}
          </div>
          <div className="text-xs text-white/50 whitespace-nowrap truncate">
            {track.album?.name}
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/15 mt-3">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: percentage + "%" }}
          ></div>
        </div>
      </div>
    </>
  );
}
