"use client";

// Animated aurora/mesh background built from BOTH album palettes.
// Renders blurred drifting colour blobs instead of a flat linear gradient.
// `palette1` / `palette2` are react-palette `data` objects (vibrant, muted, ...).
export default function AuroraBackground({ palette1, palette2 }) {
  const c1a = palette1?.vibrant || "#6366f1";
  const c1b = palette1?.darkVibrant || palette1?.muted || "#312e81";
  const c2a = palette2?.vibrant || "#d946ef";
  const c2b = palette2?.darkVibrant || palette2?.muted || "#701a75";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-950">
      {/* base wash blending both palettes */}
      <div
        className="absolute inset-0 opacity-70 transition-[background] duration-1000 ease-out"
        style={{
          backgroundImage: `radial-gradient(60% 80% at 20% 30%, ${c1b}, transparent 70%), radial-gradient(60% 80% at 80% 70%, ${c2b}, transparent 70%)`,
        }}
      />
      {/* drifting blobs */}
      <div
        className="aurora-blob aurora-blob-a w-[60vw] h-[60vw] -left-[10%] -top-[15%]"
        style={{ backgroundColor: c1a }}
      />
      <div
        className="aurora-blob aurora-blob-b w-[55vw] h-[55vw] right-[-12%] top-[10%]"
        style={{ backgroundColor: c2a }}
      />
      <div
        className="aurora-blob aurora-blob-a w-[45vw] h-[45vw] left-[30%] bottom-[-20%]"
        style={{ backgroundColor: c2b, animationDelay: "-6s" }}
      />
      {/* subtle darkening vignette for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
    </div>
  );
}
