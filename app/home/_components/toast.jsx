import { useReducer, createContext } from "react";

const ToastContext = createContext();

export default ToastContext;

const uid = () =>
  String(Date.now().toString(32) + Math.random().toString(16)).replace(
    /\./g,
    ""
  );

const toastReducer = (state, action) => {
  switch (action.type) {
    case "NOTIFICATION":
      const copy = new Map(
        state.set(action.id, {
          type: action.toastType,
          child: action.child,
        })
      );
      return copy;
    case "REMOVE":
      const removeCopy = new Map(state);
      removeCopy.delete(action.id);
      return removeCopy;
  }
};

export function ToastContextProvider({ children }) {
  //   const toasts = [
  //     { type: "error", child: <span>401</span> },
  //     { type: "success", child: <span>uploaded</span> },
  //   ];
  const [toasts, toastDispatch] = useReducer(toastReducer, new Map());

  const showToast = (toastType, child) => {
    const id = uid();
    toastDispatch({
      type: "NOTIFICATION",
      id,
      toastType,
      child,
    });

    setTimeout(() => {
      toastDispatch({
        type: "REMOVE",
        id,
      });
    }, 3000);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-0 left-0 m-4 z-50 flex flex-col gap-2">
        {[...toasts.keys()].map((key) => {
          const toast = toasts.get(key);
          const tone =
            toast.type === "success"
              ? "border-green-400/30 bg-green-500/15"
              : "border-white/10 bg-slate-900/80";
          return (
            <div
              key={key}
              className={`w-72 max-w-[90vw] rounded-xl border ${tone} px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-2xl`}
            >
              {toast.child}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
