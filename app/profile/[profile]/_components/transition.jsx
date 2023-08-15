import Image from "next/image";
import { BsFillPlayFill, BsSuitHeartFill, BsSuitHeart } from "react-icons/bs";

export default function Transition({ transition, tracks, onClick, profile }) {
  return (
    <div
      onClick={onClick}
      key={transition.id}
      className="bg-slate-800 rounded-lg hover:bg-slate-900 hover:cursor-pointer p-2"
    >
      <div className="flex">
        <Track
          percentage={
            (transition.starttime / tracks[transition.trackid1].duration_ms) *
            100
          }
          track={tracks[transition.trackid1]}
        />
        <Track percentage={0} track={tracks[transition.trackid2]} />
      </div>
      <div className="grid grid-cols-3 h-8 w-full px-2 gap-2 text-white mt-2 grow">
        <span className="invisible"></span>
        <span className="flex justify-self-center">
          {" "}
          <BsFillPlayFill size="100%" className="w-8" />
        </span>
        <span className="flex items-center gap-1 justify-self-end">
          <span>{transition.likes}</span>
          {transition.liked === "0" ? (
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
  return (
    <div className="flex flex-col w-full h-60 px-2 overflow-hidden">
      <span class="flex-none relative grow">
        <Image
          className="object-contain"
          src={track?.album?.images[0].url}
          fill={true}
          alt={track?.album?.name}
        />
      </span>
      <div className="text-center text-white">
        <div className="whitespace-nowrap truncate text-sm">{track.name}</div>
        <div className="text-xs text-white whitespace-nowrap truncate">
          {track.album.artists.map((artist, index) => {
            return index == 0 ? artist.name : ", " + artist.name;
          })}
        </div>
        <div className="text-xs text-white whitespace-nowrap truncate">
          {track.album.name}
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-600 mt-3">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: percentage + "%" }}
        ></div>
      </div>
    </div>
  );
}
