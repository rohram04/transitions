import TrackDisplay from "./trackDisplay.jsx";

export default function SelectBox({ track, ...props }) {
  return (
    <div className="p-1 m-1 w-full sm:w-1/2 min-w-0 flex">
      {track ? (
        <TrackDisplay track={track} {...props} />
      ) : (
        <div className="mx-auto mt-2 mb-auto grid place-items-center w-36 sm:w-44 aspect-square shrink-0 rounded-full border-2 border-dashed border-white/15 bg-white/5">
          <div className="text-white/40 text-sm text-center px-6">
            Select a track
          </div>
        </div>
      )}
    </div>
  );
}
