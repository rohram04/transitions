import { FiUser } from "react-icons/fi";

import { useLayoutEffect, useState } from "react";
import { getProfile } from "./getProfile.js";
import Image from "next/image";

export default function Profile({ profile }) {
  return (
    <div className="w-full h-fit flex flex-col items-center">
      {profile?.images?.length > 0 ? (
        <div className="flex h-fit justify-center w-full rounded-full">
          <span className="flex-none relative w-44 h-44 md:w-48 md:h-48 rounded-full">
            <Image
              className="object-contain rounded-full"
              src={profile?.images[1]?.url}
              fill={true}
              alt={profile.display_name}
            />
          </span>
        </div>
      ) : (
        <div className="rounded-full bg-slate-700 p-10 w-44 md:w-48 md:h-48 m-4">
          <FiUser className="w-full h-full text-white" />
        </div>
      )}
      <div className="text-2xl md:text-3xl text-white">
        {profile.display_name}
      </div>
    </div>
  );
}
