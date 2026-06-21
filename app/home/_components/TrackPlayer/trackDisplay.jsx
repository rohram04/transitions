import ProgressBar from "./progressBar";
import VinylDisc from "@/app/_components/VinylDisc";

export default function TrackDisplay({
  track,
  removeTrack,
  togglePlay,
  paused,
  onChange,
  spinning = false,
}) {
  const artUrl = track?.track?.album?.images?.[0]?.url || "";

  return (
    <div className="h-full w-full min-w-0 flex flex-col items-center p-2">
      <div className="flex flex-col grow items-center justify-center w-full min-w-0 gap-3">
        {/* Floating vinyl disc — FIXED size so both slots match exactly and it
            can never be squished by the flex column; spins while previewing. */}
        <div className="relative w-36 sm:w-44 aspect-square shrink-0">
          <VinylDisc
            src={artUrl}
            alt={track?.track?.album?.name}
            isSpinning={spinning}
          />
        </div>
        <div
          tabIndex={0}
          className="w-full min-w-0 text-center text-white group focus:whitespace-normal scrollbar-hide"
        >
          <div className="text-sm font-semibold truncate group-focus:whitespace-normal">
            {track.track.name}
          </div>
          <div className="text-sm text-white/80 truncate group-focus:whitespace-normal">
            {track.track.album.artists.map((artist, index) =>
              index === 0 ? artist.name : ", " + artist.name
            )}
          </div>
          <div className="text-sm text-white/50 truncate group-focus:whitespace-normal">
            {track.track.album.name}
          </div>
        </div>
      </div>
      <div className="p-2 w-full min-w-0">
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
