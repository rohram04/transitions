"use client";

import { Fragment, useRef, useState, useEffect, useReducer } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TrackPlayer from "./TrackPlayer/trackPlayer";
import Image from "next/image";

import Search from "./Search/search";
import Track from "./Search/track";
import Logo from "./logo.jsx";

const selectedTracksReducer = (state, action) => {
  switch (action.type) {
    case "REMOVE_TRACK":
      const copy = { ...state };
      delete copy[action.key];
      return copy;
    case "ADD_TRACK":
      if (!(0 in state)) {
        const copy = { ...state };
        if (1 in state) copy[1].position = 0;
        copy[0] = {
          track: action.track,
          position: action.track.duration_ms - 15000,
          time: action.track.duration_ms - 15000,
        };
        return copy;
      }
      return {
        ...state,
        1: { track: action.track, position: 0 },
      };
    case "POSITION":
      return {
        ...state,
        [action.key]: { ...state[action.key], position: action.position },
      };
    case "INCREMENT_POSITION":
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          position: Number(state[action.key].position) + action.increment,
        },
      };
    case "TIME":
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          time: action.time,
        },
      };
    case "CLEAR":
      return {};
  }
};

export default function Modal({
  open = false,
  onClose: close,
  player,
  playerState,
  device_id,
}) {
  const [selectedTracks, selectedTracksDispatch] = useReducer(
    selectedTracksReducer,
    {}
  );
  const [previewing, setPreviewing] = useState(false);
  const selectedTracksRef = useRef();
  const intervalRef = useRef();

  const onClose = () => {
    console.log("hello");
    close();
    selectedTracksDispatch({ type: "CLEAR" });
  };

  useEffect(() => {
    selectedTracksRef.current = selectedTracks;
  }, [selectedTracks]);

  useEffect(() => {
    const positionControl = (state) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!(0 in selectedTracksRef.current || 1 in selectedTracksRef.current))
        return;
      let key = Object.keys(selectedTracksRef.current)[0];
      if (0 in selectedTracksRef.current && 1 in selectedTracksRef.current)
        key =
          state.track_window.current_track.id ==
          selectedTracksRef.current[0].track.id
            ? 0
            : 1;
      // if (key === 0) return;
      selectedTracksDispatch({
        type: "POSITION",
        key: key,
        position: state.position,
      });
      if (state.paused) return;
      intervalRef.current = setInterval(() => {
        if (
          selectedTracksRef.current[key].position >=
          selectedTracksRef.current[key].track.duration_ms
        )
          return clearInterval(intervalRef.current);
        selectedTracksDispatch({
          type: "INCREMENT_POSITION",
          key: key,
          increment: 1000,
        });
      }, 1000);
    };

    player.addListener("player_state_changed", positionControl);
  }, [player]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center md:p-4 text-center md:items-center md:p-0 h-full md:h-fit w-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden md:rounded-lg bg-white text-left shadow-xl transition-all md:my-8 w-full md:max-w-4xl h-full">
                <div className="bg-slate-900 p-2 px-4 pb-4 md:p-6 md:pb-4 h-full md:h-fit flex flex-col md:flex-row">
                  <div
                    className={`h-full flex flex-col items-center w-full md:w-1/3
                        ${
                          Object.keys(selectedTracks).length == 2
                            ? " hidden md:flex"
                            : ""
                        } `}
                  >
                    <Logo onClose={onClose} />
                    <Search
                      onClick={(track) => {
                        selectedTracksDispatch({
                          type: "ADD_TRACK",
                          track,
                        });
                        player.pause();
                        setPreviewing(false);
                      }}
                      selectDisabled={Object.keys(selectedTracks).length == 2}
                    >
                      <div className="mb-2 md:hidden flex flex-col gap-2">
                        {Object.keys(selectedTracks).map((key) => {
                          return (
                            <Track
                              key={key}
                              track={selectedTracks[key].track}
                            />
                          );
                        })}
                      </div>
                    </Search>
                    <span className="w-28 h-10 relative min-w-[70px] hidden md:block flex-none mt-4">
                      <Image
                        src="/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_White.png"
                        fill={true}
                        className="object-contain "
                      />
                    </span>
                  </div>
                  <TrackPlayer
                    className={
                      Object.keys(selectedTracks).length !== 2 &&
                      "hidden md:flex"
                    }
                    device_id={device_id}
                    playerState={playerState}
                    selectedTracks={selectedTracks}
                    selectedTracksDispatch={selectedTracksDispatch}
                    setPreviewing={setPreviewing}
                    player={player}
                    previewing={previewing}
                    onClose={onClose}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
