"use client";

// Generic shimmer skeleton block. Shimmer keyframe lives in globals.css.
export function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`skeleton-shimmer rounded-2xl bg-white/5 ${className}`}
      aria-hidden="true"
    />
  );
}

// Full-page skeleton that mirrors the Look B player layout
// (vinyl hero + two track cards + floating dock).
export default function PlayerSkeleton() {
  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden bg-slate-950 p-4 sm:p-8">
      {/* faint aurora wash so the skeleton matches the loaded look */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="aurora-blob aurora-blob-a w-[55vw] h-[55vw] -left-10 -top-10 bg-indigo-700/40" />
        <div className="aurora-blob aurora-blob-b w-[50vw] h-[50vw] right-0 bottom-0 bg-fuchsia-700/40" />
      </div>

      <div className="relative z-10 flex flex-col items-center grow gap-8 pt-6 sm:flex-row sm:justify-center sm:gap-16">
        <div className="flex flex-col items-center gap-4">
          <SkeletonBlock className="w-48 h-48 sm:w-72 sm:h-72 rounded-full" />
          <SkeletonBlock className="w-40 h-5" />
          <SkeletonBlock className="w-28 h-4" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <SkeletonBlock className="w-40 h-40 sm:w-56 sm:h-56" />
          <SkeletonBlock className="w-36 h-5" />
          <SkeletonBlock className="w-24 h-4" />
        </div>
      </div>

      <div className="relative z-10 mx-auto mb-4 flex w-full max-w-2xl items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <SkeletonBlock className="w-12 h-12 rounded-full" />
        <SkeletonBlock className="w-12 h-12 rounded-full" />
        <SkeletonBlock className="w-16 h-16 rounded-full" />
        <SkeletonBlock className="w-12 h-12 rounded-full" />
        <SkeletonBlock className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
}
