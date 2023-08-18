import { Fragment, useRef, useState, useEffect, useReducer } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MdClose } from "react-icons/md";
import Link from "next/link";
import { deleteAccount, logout } from "./action";

export default function DeleteAccountModal({ open, onClose, logout }) {
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
          <div className="flex min-h-full justify-center sm:p-4 items-center sm:p-0 h-fit">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-900 text-left shadow-xl transition-all sm:my-8 w-4/5 sm:max-w-2xl">
                <div className="h-fit w-full p-6 text-left">
                  <button
                    className="hidden sm:block absolute top-0 right-0 h-10 w-10 hover:opacity-50 transition ease-in-out duration-300 text-white p-0.5 m-2 z-20"
                    onClick={onClose}
                  >
                    <MdClose size="100%" />
                  </button>
                  <h1 className="text-xl mb-4">
                    Are you sure you want to delete your account?
                  </h1>
                  <p>
                    This means all data associated with your spotify account
                    that exists in the transitions application will be removed.
                    This includes but is not limited to your display name,
                    spotify id, as well as all uploaded transitions and their
                    corresponding likes. To completely disconnect your spotify
                    account you must disconnect transitions by clicking remove
                    access in your{" "}
                    <Link
                      href="https://www.spotify.com/us/account/apps/"
                      target="_blank"
                      className="underline"
                    >
                      spotify account settings
                    </Link>
                    .
                  </p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg bg-slate-800 w-full sm:w-fit hover:opacity-70 transition ease-in-out duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await deleteAccount();
                        await logout();
                      }}
                      className="p-2 rounded-lg bg-red-800 w-full sm:w-fit hover:opacity-70 transition ease-in-out duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
