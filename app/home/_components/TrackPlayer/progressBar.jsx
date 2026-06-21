import { useState } from "react";

export default function ProgressBar({
  progress = 0,
  duration = 100,
  onChange,
  disabled,
  value,
  removeTrack,
}) {
  // const [inputActive, setInputActive] = useState(false);
  let percentage = (progress / duration) * 100;
  if (percentage < 1) percentage = 0;
  const convertedValue = convertMilliseconds(value);
  const convertedProgress = convertMilliseconds(progress);

  return (
    // <div className="rounded-full h-2.5 bg-slate-600">
    //   <div
    //     className="rounded-full bg-blue-500 h-2.5"
    //     style={{ width: progress + "%" }}
    //   ></div>
    // </div>
    <div className="relative w-full place-self-center">
      {/* <input
        type="range"
        min={0}
        value={progress}
        max={duration}
        // onChange={onChange}
        className="w-full h-2.5 rounded-full cursor-pointer bg-slate-600 progress"
        disabled={disabled}
      /> */}
      <div className={"text-sm text-white/80 tabular-nums" + (value ? "" : " invisible")}>
        {convertedValue}
      </div>
      <div className="mt-2">
        {value && (
          <input
            type="range"
            min={0}
            max={duration}
            className="w-full h-1.5 rounded-full cursor-pointer bg-transparent absolute"
            onChange={onChange}
            value={value}
          />
        )}
        <div className="w-full h-1.5 rounded-full bg-white/15 mb-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: percentage + "%" }}
          ></div>
        </div>
      </div>
      <div className="flex">
        <button
          className="text-white/50 hover:text-white transition w-min place-self-start text-sm"
          onClick={removeTrack}
        >
          Remove
        </button>
        <div className="text-sm grow text-right text-white/80 tabular-nums">{convertedProgress}</div>
      </div>
    </div>
  );
}

function convertMilliseconds(ms) {
  const time = new Date(Number(ms));
  return `${time.getMinutes()}:${time
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}
