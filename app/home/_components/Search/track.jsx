import Image from "next/image";

export default function Track({ track }) {
  let artists = track.artists[0].name;

  for (let i = 1; i < track.artists.length; i++) {
    artists += ", " + track.artists[i].name;
  }

  return (
    <div className="transition ease-in-out hover:bg-slate-600 duration-300 hover:cursor-pointer rounded-lg bg-slate-800 flex w-full h-full place-items-center">
      <span className="flex-none w-14 h-14 relative">
        <Image
          className="object-contain rounded-lg max-w-fit p-2"
          src={track?.album?.images[0].url}
          fill={true}
          alt={track?.album?.name}
        />
      </span>
      <span class="flex flex-col flex-initial py-2 min-w-0">
        <div className="truncate text-sm text-white">{track.name}</div>
        <div className="truncate text-xs text-white">{artists}</div>
      </span>
    </div>
  );
}

// export function SelectedTrack({ track, removeTrack }) {
//   let artists = track.artists[0].name;

//   for (let i = 1; i < track.artists.length; i++) {
//     artists += ", " + track.artists[i].name;
//   }

//   return (
//     <div className="group transition ease-in-out duration-300 hover:cursor-pointer rounded-lg bg-slate-800 flex w-full h-full">
//       <span className="flex-none w-1/3 relative">
//         <Image
//           className="object-contain rounded-lg max-w-fit p-2"
//           src={track?.album?.images[0].url}
//           fill={true}
//           alt={track?.album?.name}
//         />
//       </span>
//       <span class="flex flex-col flex-initial py-2 min-w-0 grow">
//         <div className="truncate text-sm">{track.name}</div>
//         <div className="truncate text-xs">{artists}</div>
//       </span>
//       <span>
//         <button
//           onClick={removeTrack}
//           className="hover:bg-slate-600 z-10 mt-1 px-2 mr-1 text-xl rounded-lg "
//         >
//           &#128465;
//         </button>
//       </span>
//     </div>
//   );
// }
