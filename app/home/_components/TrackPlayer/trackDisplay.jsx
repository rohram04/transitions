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
    <div className="h-full flex flex-col items-center p-2">
      <div className="flex flex-col grow items-center justify-center w-full gap-3">
        {/* Floating vinyl disc (spins while this track previews) */}
        <div className="relative w-full max-w-[11rem] sm:max-w-[12rem] aspect-square mx-auto">
          <VinylDisc
            src={artUrl}
            alt={track?.track?.album?.name}
            isSpinning={spinning}
          />
        </div>
        <div
          tabIndex={0}
          className="text-center text-white whitespace-nowrap truncate group focus:overflow-y-scroll focus:whitespace-normal scrollbar-hide w-full"
        >
          <div className="text-sm font-semibold whitespace-nowrap truncate group-focus:whitespace-normal">
            {track.track.name}
          </div>
          <div className="text-sm text-white/80 whitespace-nowrap truncate group-focus:whitespace-normal">
            {track.track.album.artists.map((artist, index) =>
              index === 0 ? artist.name : ", " + artist.name
            )}
          </div>
          <div className="text-sm text-white/50 whitespace-nowrap truncate group-focus:whitespace-normal">
            {track.track.album.name}
          </div>
        </div>
      </div>
      <div className="p-2 w-full">
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
