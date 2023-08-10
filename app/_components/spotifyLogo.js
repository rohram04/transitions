import Image from "next/image";

export default function Logo() {
  return (
    <>
      <span className="flex-none w-28 h-10 relative min-w-[70px] ml-2 hidden sm:block mx-4">
        <Image
          src="/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_White.png"
          fill={true}
          className="object-contain "
        />
      </span>
      <span className="flex-none h-10 relative w-10 m-2 block sm:hidden min-w-[21px] min-h-[21px]">
        <Image
          src="/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_White.png"
          fill={true}
          className="object-contain"
        />
      </span>
    </>
  );
}
