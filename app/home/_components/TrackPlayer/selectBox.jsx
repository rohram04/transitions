import TrackDisplay from "./trackDisplay.jsx";

export default function SelectBox({ track, ...props }) {
  return (
    <div className="p-1 m-1 w-1/2 overflow-hidden grow w-full">
      {track ? (
        <TrackDisplay track={track} {...props} />
      ) : (
        <div className="grid h-full border border-dashed border-white/15 bg-white/5 rounded-2xl">
          <div className="h-min place-self-center text-white/40">
            Please Select a track
          </div>
        </div>
      )}
    </div>
  );
}
