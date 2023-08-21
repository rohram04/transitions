import Link from "next/link";
import Image from "next/image";

export default function Footer({ href }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={href}
        className="text-white bottom-0 w-fit flex items-center justify-center underline"
        target="_blank"
      >
        <span className="flex-none relative m-2 block min-w-[21px] min-h-[21px]">
          <Image
            src="/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_White.png"
            fill={true}
            className="object-contain"
          />
        </span>
        <p>OPEN SPOTIFY</p>
      </Link>
      <p>or</p>
      <Link
        href="https://www.spotify.com/us/download"
        className="text-center underline"
        target="_blank"
      >
        Get Spotify Free
      </Link>
    </div>
  );
}
