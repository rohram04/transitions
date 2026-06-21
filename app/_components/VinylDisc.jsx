import Image from "next/image";

// Rotating vinyl record. Album art becomes the centre label.
// Spins (via .spinning + CSS keyframe) only when isSpinning is true.
export default function VinylDisc({ src, alt, isSpinning }) {
  return (
    <div className={`vinyl-disc${isSpinning ? " spinning" : ""}`}>
      <div className="vinyl-label">
        {src && (
          <Image
            src={src}
            fill
            alt={alt ?? ""}
            sizes="(min-width: 1536px) 34rem, (min-width: 1280px) 30rem, (min-width: 1024px) 24rem, (min-width: 640px) 20rem, 12rem"
            className="object-cover rounded-full"
          />
        )}
        <div className="vinyl-hole" />
      </div>
    </div>
  );
}
