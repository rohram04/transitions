"use client";

// The signature element: one connected timeline for the whole transition.
// Track 1 fills its half left -> right; at the centre sits the amber "cut"
// marker (the handoff); track 2 fills its half outward from the cut. As
// playback advances, the playhead visibly passes the baton across the cut —
// embodying the brief ("the moment one song becomes another").
//
// Purely presentational: it reads the same progress state the player already
// computes (progress1/progress2, playingIndex) and never touches playback.
export default function SegueTimeline({
  track1,
  track2,
  progress1 = 0,
  progress2 = 0,
  playingIndex,
  reduceMotion,
}) {
  const pct = (p, t) => {
    const d = t?.duration_ms || 0;
    if (!d) return 0;
    let v = (p / d) * 100;
    if (v > 100) v = 100;
    if (v < 0) v = 0;
    return v;
  };

  const pct1 = pct(progress1, track1);
  const pct2 = pct(progress2, track2);

  const fillTransition = reduceMotion
    ? ""
    : " transition-[width] duration-500 ease-linear";

  // Active half gets a solid white fill; the other is muted.
  const fill1 = playingIndex === 1 ? "bg-white/45" : "bg-white";
  const fill2 = playingIndex === 1 ? "bg-white" : "bg-white/45";

  return (
    <div className="mx-auto mb-3 w-full max-w-3xl px-2 sm:px-0">
      <div className="flex items-stretch gap-0">
        {/* Track 1 half — fills left -> centre */}
        <div className="flex-1 h-1.5 rounded-l-full bg-white/15 overflow-hidden">
          <div
            className={`h-full rounded-l-full${fillTransition} ${fill1}`}
            style={{ width: pct1 + "%" }}
          />
        </div>

        {/* The cut — amber cue marker at the seam */}
        <div className="relative flex-none w-0">
          <span
            className="absolute -top-1 left-1/2 -translate-x-1/2 h-3.5 w-0.5 rounded-full bg-cue shadow-[0_0_8px_rgba(255,176,32,0.7)]"
            aria-hidden="true"
          />
        </div>

        {/* Track 2 half — fills centre -> right */}
        <div className="flex-1 h-1.5 rounded-r-full bg-white/15 overflow-hidden">
          <div
            className={`h-full rounded-r-full${fillTransition} ${fill2}`}
            style={{ width: pct2 + "%" }}
          />
        </div>
      </div>

      {/* Mono timecodes anchored to each end, "cut" label at the seam. */}
      <div className="mt-1.5 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-wider text-white/45 tabular-nums">
        <span className={playingIndex === 0 ? "text-white/80" : ""}>
          {fmt(progress1)}
        </span>
        <span className="text-cue/90 tracking-[0.2em]">cut</span>
        <span className={playingIndex === 1 ? "text-white/80" : ""}>
          {fmt(progress2)}
        </span>
      </div>
    </div>
  );
}

function fmt(ms) {
  const total = Math.max(0, Math.floor(Number(ms) / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
