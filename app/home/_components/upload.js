"use client";

import Modal from "./uploadModal";
import { Fragment, useState } from "react";
import { BiPlus } from "react-icons/bi";

export default function Upload(props) {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <button
        onClick={() => setOpen(true)}
        className="h-14 rounded-lg hover:opacity-50 transition ease-in-out duration-300"
      >
        <BiPlus size="auto" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} {...props} />
    </Fragment>
  );
}
