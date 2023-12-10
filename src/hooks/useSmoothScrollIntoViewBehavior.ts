import { useEffect, useRef } from "react";

export const useSmoothScrollIntoViewBehavior = () => {
  const refHookMounted = useRef<boolean | null>(null);

  useEffect(() => {
    refHookMounted.current = true;

    return () => {
      refHookMounted.current = false;
    };
  });

  if (refHookMounted.current) {
    const isSmoothBehaviorSupported =
      "scrollBehavior" in window.document.documentElement.style;

    if (isSmoothBehaviorSupported) {
      return "smooth";
    }
  }

  return "auto";
};
