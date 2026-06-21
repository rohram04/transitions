// Now-playing equalizer. Bars bounce while isPlaying, freeze otherwise.
export default function EqualizerBars({ isPlaying }) {
  return (
    <div
      className={`flex items-end gap-0.5 h-5${isPlaying ? "" : " paused"}`}
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="eq-bar w-1 rounded-sm bg-white"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}
