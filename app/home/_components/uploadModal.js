"use client";

import { Fragment, useRef, useState, useReducer, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TrackPlayer from "./TrackPlayer/trackPlayer";
import Search from "./Search/search";
import Track from "./Search/track";
import Logo from "./logo.jsx";

const selectedTracksReducer = (state, action) => {
  switch (action.type) {
    case "REMOVE_TRACK": {
      const copy = { ...state };
      delete copy[action.key];
      return copy;
    }
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
    default:
      return state;
  }
};

export default function Modal({ open = false, onClose: close, ytPlayer, onModalPreviewStart, onModalPreviewEnd }) {
  const [selectedTracks, selectedTracksDispatch] = useReducer(
    selectedTracksReducer,
    {}
  );
  const [previewing, setPreviewing] = useState(false);
  const [playingKey, setPlayingKey] = useState(null);
  const selectedTracksRef = useRef();

  useEffect(() => {
    selectedTracksRef.current = selectedTracks;
  }, [selectedTracks]);

  const onClose = () => {
    close();
    ytPlayer?.pauseAll();
    onModalPreviewEnd?.();
    setPreviewing(false);
    setPlayingKey(null);
    selectedTracksDispatch({ type: "CLEAR" });
  };

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
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center md:p-4 text-center md:items-center h-full md:h-fit w-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden md:rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 text-left shadow-2xl transition-all md:my-8 w-full md:max-w-4xl h-fit md:h-full">
                <div className="p-2 px-4 pb-4 md:p-6 md:pb-4 h-fit md:h-[35rem] flex flex-col md:flex-row">
                  <div
                    className={`md:h-full flex flex-col items-center w-full md:w-1/3 ${
                      Object.keys(selectedTracks).length === 2
                        ? "hidden md:flex"
                        : ""
                    }`}
                  >
                    <Logo onClose={onClose} />
                    <Search
                      onClick={(track) => {
                        selectedTracksDispatch({ type: "ADD_TRACK", track });
                        ytPlayer?.pauseAll();
                        setPreviewing(false);
                        setPlayingKey(null);
                      }}
                      selectDisabled={Object.keys(selectedTracks).length === 2}
                    >
                      <div className="mb-2 md:hidden flex flex-col gap-2">
                        {Object.keys(selectedTracks).map((key) => (
                          <Track key={key} track={selectedTracks[key].track} />
                        ))}
                      </div>
                    </Search>
                  </div>
                  <TrackPlayer
                    className={
                      Object.keys(selectedTracks).length !== 2 && "hidden md:flex"
                    }
                    ytPlayer={ytPlayer}
                    selectedTracks={selectedTracks}
                    selectedTracksDispatch={selectedTracksDispatch}
                    setPreviewing={setPreviewing}
                    previewing={previewing}
                    playingKey={playingKey}
                    setPlayingKey={setPlayingKey}
                    onClose={onClose}
                    onModalPreviewStart={onModalPreviewStart}
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
