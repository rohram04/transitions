import TrackDisplay from "./trackDisplay.jsx";

export default function SelectBox({ track, ...props }) {
  return (
    <div className="p-1 m-1 grow w-full flex">
      {track ? (
        <TrackDisplay track={track} {...props} />
      ) : (
        <div className="m-auto grid place-items-center w-full max-w-[12rem] aspect-square rounded-full border-2 border-dashed border-white/15 bg-white/5">
          <div className="text-white/40 text-sm text-center px-6">
            Select a track
          </div>
        </div>
      )}
    </div>
  );
}
