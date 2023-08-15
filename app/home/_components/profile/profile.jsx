import { useState, useEffect, useTransition, Fragment } from "react";
import { getUser, logout } from "./action";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsCaretDownFill } from "react-icons/bs";
import { FiUser } from "react-icons/fi";

export default function Profile({ player }) {
  const [profile, setProfile] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  let [isPending, startTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const profile = await getUser();
      setProfile(profile);
    };

    getProfile();
  }, []);

  if (Object.keys(profile).length == 0)
    return <div className="z-10 m-2 h-40"></div>;

  return (
    <div
      className="z-10 m-2 w-fit"
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setShowMenu(false);
      }}
    >
      <button
        onClick={() => setShowMenu((state) => !state)}
        className="flex gap-2 p-2 rounded-lg bg-slate-600 hover:opacity-70 transition ease-in-out duration-300"
      >
        <span className="flex-none h-fit relative">
          {profile?.images?.length > 0 ? (
            <Image
              className="object-contain rounded-full"
              src={profile?.images[1]?.url}
              height={40}
              width={40}
              alt={profile.display_name}
            />
          ) : (
            <FiUser size={40} className="bg-slate-800 p-2 rounded-full" />
          )}
        </span>
        <div className="h-min place-self-center text-white">
          {profile.display_name}
        </div>
        <div className="place-self-center text-white h-6 w-6">
          <BsCaretDownFill size="100%" />
        </div>
      </button>
      <Transition
        show={showMenu}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div
          className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-slate-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div class="py-1" role="none">
            <button
              onClick={async () => {
                await player?.disconnect();
                router.push(`/profile/${profile.id}`);
              }}
              class="text-white block px-4 py-2 text-sm text-left transition ease-in-out duration-300 hover:text-white/50"
              role="menuitem"
              tabindex="-1"
              id="menu-item-0"
            >
              View Profile
            </button>
            <button
              onClick={async () => {
                await player?.disconnect();
                startTransition(() => logout());
              }}
              class="text-white block w-full px-4 py-2 text-left text-sm transition ease-in-out duration-300 hover:text-white/50"
              role="menuitem"
              tabindex="-1"
              id="menu-item-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
}
