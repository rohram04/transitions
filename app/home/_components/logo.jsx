import Image from "next/image";
import { MdClose } from "react-icons/md";

export default function Logo({ onClose }) {
  return (
    <div className="sm:hidden flex flex-row justify-between w-full mb-1">
      <span className="w-24 h-10 relative min-w-[70px]">
        <Image
          src="/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_White.png"
          fill={true}
          className="object-contain "
        />
      </span>
      <button
        className="h-10 w-10 hover:opacity-50 transition ease-in-out duration-300 text-white p-0.5"
        onClick={onClose}
      >
        <MdClose size="100%" />
      </button>
    </div>
  );
}
