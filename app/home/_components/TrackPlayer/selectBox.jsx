import TrackDisplay from "./trackDisplay.jsx";

export default function SelectBox({ track, ...props }) {
  return (
    <div className="p-1 m-1 w-1/2 overflow-hidden grow w-full">
      {track ? (
        <TrackDisplay track={track} {...props} />
      ) : (
        <div className="grid h-full border-4 border-dashed border-slate-500 rounded-xl">
          <div className="h-min place-self-center text-slate-500">
            Please Select a track
          </div>
        </div>
      )}
    </div>
  );
}
