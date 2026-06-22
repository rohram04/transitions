import ProgressBar from "./progressBar";
import VinylDisc from "@/app/_components/VinylDisc";

export default function TrackDisplay({
  track,
  removeTrack,
  togglePlay,
  paused,
  onChange,
  spinning = false,
  preparing = false,
}) {
  const artUrl = track?.track?.album?.images?.[0]?.url || "";

  return (
    <div className="h-full w-full min-w-0 flex flex-col items-center p-2">
      <div className="flex flex-col grow items-center justify-center w-full min-w-0 gap-3">
        {/* Floating vinyl disc — fills the slot width (capped) so it flexes
            into the available space; equal slots (w-1/2 + min-w-0) keep both
            discs identical and square, so it can't distort. Spins while previewing. */}
        <div className="relative w-full max-w-[14rem] aspect-square mx-auto">
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
          {preparing && (
            <div className="text-xs text-white/40 mt-1">Preparing preview…</div>
          )}
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
