import Image from "next/image";
import ProgressBar from "./progressBar";
import Link from "next/link";

export default function TrackDisplay({
  track,
  removeTrack,
  togglePlay,
  paused,
  onChange,
}) {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl flex flex-col p-3">
      <div className="flex flex-col grow">
        <span class="flex-none relative grow overflow-hidden rounded-xl">
          <Image
            className="object-contain p-2"
            src={track?.track?.album?.images[0].url}
            fill={true}
            alt={track?.track?.album?.name}
          />
        </span>
        <div
          tabIndex={0}
          className="text-center text-white whitespace-nowrap truncate group focus:overflow-y-scroll focus:whitespace-normal scrollbar-hide mt-2"
        >
          <div className="text-sm font-semibold whitespace-nowrap truncate group-focus:whitespace-normal group-focus:overflow-none">
            {track.track.name}
          </div>
          <div className="text-sm text-white/80 whitespace-nowrap truncate group-focus:whitespace-normal group-focus:overflow-none">
            {track.track.album.artists.map((artist, index) => {
              return index == 0 ? artist.name : ", " + artist.name;
            })}
          </div>
          <div className="text-sm text-white/50 whitespace-nowrap truncate group-focus:whitespace-normal group-focus:overflow-none">
            {track.track.album.name}
          </div>
        </div>
      </div>
      {/* <button
        onClick={togglePlay}
        className="place-self-center hover:bg-slate-700 bg-slate-800 rounded-full w-fit py-2 px-3 m-1 mx-2"
      >
        {active && !paused ? <>&#x23F8;</> : <>&#9658;</>}
      </button> */}
      <div className="p-2">
        <ProgressBar
          progress={track?.position}
          duration={track.track?.duration_ms}
          onChange={onChange}
          value={track?.time}
          removeTrack={removeTrack}
        />
      </div>
    </div>
  );
}
