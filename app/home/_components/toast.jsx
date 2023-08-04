import { useReducer, createContext, useEffect } from "react";
import { Transition } from "@headlessui/react";

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

  useEffect(() => {
    console.log(toasts.keys());
  }, [toasts]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-0 left-0 m-4">
        {[...toasts.keys()].map((key) => {
          const toast = toasts.get(key);
          console.log(toast);
          switch (toast.type) {
            case "error":
              return (
                <div className="bg-slate-600 p-3 w-72 m-2 rounded-lg">
                  {toast.child}
                </div>
              );
            case "success":
              return (
                <Transition
                  appear={true}
                  show={true}
                  entering="transform transition-opacity ease-in duration-500"
                  enterFrom="opacity-0"
                  entered="opacity-100"
                >
                  <div className="bg-green-700 p-3 m-2 rounded-lg">
                    {toast.child}
                  </div>
                </Transition>
              );
          }
        })}
      </div>
    </ToastContext.Provider>
  );
}
