import { Fragment, useRef, useState, useEffect, useReducer } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MdClose } from "react-icons/md";
import Link from "next/link";

export default function PrivacyPolicyModal({
  open,
  onClose,
  setDeleteAccountModalOpen,
}) {
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
          <div className="flex min-h-full items-end justify-center sm:p-4 text-center sm:items-center sm:p-0 h-full sm:h-fit w-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden sm:rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl h-full">
                <div className="w-full h-full p-6 text-center bg-slate-800 overflow-y-scroll scrollbar-hide">
                  <button
                    className="absolute top-0 right-0 h-10 w-10 hover:opacity-50 transition ease-in-out duration-300 text-white p-0.5 m-2 z-20"
                    onClick={onClose}
                  >
                    <MdClose size="100%" />
                  </button>
                  <h1 className="text-3xl p-2">Privacy Policy</h1>

                  <div className="text-left p-2 first:mt-0 last:mb-0">
                    <Section header="What data we use and how do we use it?">
                      <p className="">
                        transitions.ro-hith.com uses your Spotify account to
                        play songs from Spotify, access track metadata (ie.
                        album covers, artists, songnames, album names, etc).
                        access your profile picture, displayname, and Spotify
                        id. The only user data directly stored in our
                        application is your Spotify id. The Spotify id is then
                        used to keep track of the transitions you create as well
                        as the transitions you have liked. It is also used in
                        the link for your profile page.
                      </p>
                    </Section>

                    <Section header="How do I unlink my account?">
                      <p className="">
                        To remove this applications access to your Spotify
                        account, click remove access for &quot;Transitions&quot;
                        on{" "}
                        <Link
                          className="underline"
                          href="https://www.spotify.com/account/apps/"
                          target="_blank"
                        >
                          Spotify's Third Party App Page
                        </Link>{" "}
                        (Note this does not delete your account or your uploaded
                        transitions from transitions.ro-hith.com; To do so
                        navigate to{" "}
                        <button
                          className="underline"
                          onClick={() => {
                            onClose();
                            setDeleteAccountModalOpen(true);
                          }}
                        >
                          Delete Account
                        </button>
                        ).
                      </p>
                    </Section>

                    <Section header="How do we use cookies?">
                      <p>
                        We use cookies to store your user profile. This allows
                        us to know you are the one logged in even when a page
                        change occurs. The only thing we store in a cookie is
                        your Spotify user profile and nothing else. Visit{" "}
                        <Link
                          href="https://allaboutcookies.org"
                          className="underline"
                          target="_blank"
                        >
                          allaboutcookies.org
                        </Link>{" "}
                        for more information on how cookies work and how to
                        remove them from your browser. Please note if you remove
                        or disable cookies, some of this applications
                        functionality may not work as expected.
                      </p>
                    </Section>

                    <p className="text-slate-400">Last Updated 8/18/2023</p>
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

function Section({ header, children }) {
  return (
    <>
      <h2 className="text-xl mb-2">{header}</h2>
      <div className="mb-4">{children}</div>
    </>
  );
}
