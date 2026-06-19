import { MdClose } from "react-icons/md";

export default function Logo({ onClose }) {
  return (
    <div className="md:hidden flex flex-row justify-between w-full mb-1">
      <span className="flex items-center h-10">
        <span className="text-white text-xl font-bold tracking-widest uppercase">
          Transitions
        </span>
      </span>
      <button
        className="h-10 w-10 hover:opacity-50 transition ease-in-out duration-300 text-white p-0.5"
        onClick={onClose}
      >
        <MdClose size="100%" />
      </button>
    </div>
  );
}
