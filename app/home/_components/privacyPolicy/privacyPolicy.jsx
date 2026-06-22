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
                      <p>
                        Transitions uses GitHub, Google, or a username and
                        password to sign you in. For OAuth sign-in we store your
                        provider account id, display name, and profile picture
                        URL. For username/password accounts we store a hashed
                        password and the username you chose. When you upload a
                        transition we store the two tracks&apos; metadata (from
                        the iTunes Search API), the transition timing, and
                        cached YouTube video ids used for playback. Your account
                        id is also used for likes and your profile page URL.
                      </p>
                    </Section>

                    <Section header="How do I unlink my account?">
                      <p>
                        To delete your Transitions account and remove your
                        uploaded transitions and likes from our database, use{" "}
                        <button
                          className="underline"
                          onClick={() => {
                            onClose();
                            setDeleteAccountModalOpen(true);
                          }}
                        >
                          Delete Account
                        </button>
                        . If you signed in with GitHub or Google, you can also
                        revoke this app&apos;s access in your GitHub or Google
                        account security settings.
                      </p>
                    </Section>

                    <Section header="How do we use cookies?">
                      <p>
                        We use session cookies managed by NextAuth so you stay
                        signed in across page loads. Visit{" "}
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

                    <p className="text-slate-400">Last Updated 6/21/2026</p>
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
