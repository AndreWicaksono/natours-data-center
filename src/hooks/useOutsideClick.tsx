import { RefObject, useEffect, useRef } from "react";

type Handler = (event: MouseEvent) => void;

export function useOutsideClick(
  handler: Handler,
  listenCapturing: boolean = true
) {
  const ref: RefObject<HTMLElement> = useRef(null);

  useEffect(
    function () {
      const handleClick: (e: MouseEvent) => void = (e): void => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          handler(e);
        }
      };

      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
