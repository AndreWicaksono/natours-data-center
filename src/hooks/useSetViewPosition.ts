import { RefObject } from "react";

type SetViewPosition_Argument_Object = {
  behavior: "auto" | "instant" | "smooth";
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  ref: RefObject<HTMLDivElement>;
};

export const useSetViewPosition = (): ((
  argument: SetViewPosition_Argument_Object
) => void) => {
  const setViewPosition = ({
    behavior,
    block,
    inline,
    ref,
  }: SetViewPosition_Argument_Object) => {
    if (ref?.current?.scrollIntoView) {
      ref.current.scrollIntoView({
        behavior: behavior,
        block,
        inline,
      });
    }
  };

  return setViewPosition;
};
