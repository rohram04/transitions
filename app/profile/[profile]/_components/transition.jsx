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
      <div className="flex h-8 w-full justify-center px-2 gap-2">
        <span className="flex items-center gap-1">
          <span>{transition.likes}</span>
          {transition.liked === "0" ? (
            <BsSuitHeart size="auto" className="p-1" />
          ) : (
            <BsSuitHeartFill size="auto" className="text-red-500 p-1" />
          )}
        </span>
        <BsFillPlayFill size="auto" className="w-fit" />
      </div>
    </div>
  );
}

function Track({ track, percentage }) {
  return (
    <div className="flex flex-col w-full h-48 px-2 overflow-hidden">
      <span class="flex-none relative basis-2/3">
        <Image
          className="object-contain max-h-min"
          src={track?.album?.images[0].url}
          fill={true}
          alt={track?.album?.name}
        />
      </span>
      <div className="text-center whitespace-nowrap truncate">
        {track?.name}
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-600 my-2">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: percentage + "%" }}
        ></div>
      </div>
    </div>
  );
}
