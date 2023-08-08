import Image from "next/image";

export default function Transition({ transition, track1, track2 }) {
  return (
    <div className="flex w-full snap-center rounded-lg h-72 bg-slate-800">
      <Track track={track1} />
      <Track track={track2} />
    </div>
  );
}

function Track({ track, progress = 0 }) {
  let percentage = (progress / track.duration_ms) * 100;
  if (percentage < 1) percentage = 0;
  //   if (percentage > 99) percentage = 100;

  return (
    <div className="flex flex-col basis-1/2 px-4 py-4 gap-2 overflow-hidden ">
      <span class="flex-none relative grow">
        <Image
          className="object-contain"
          src={track?.album?.images[0].url}
          fill={true}
          alt={track?.album?.name}
        />
      </span>
      <div className="text-center text whitespace-nowrap truncate text-white">
        {track?.name}
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-600 mb-2">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: percentage + "%" }}
        ></div>
      </div>
    </div>
  );
}
