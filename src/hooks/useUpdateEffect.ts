import { DependencyList, EffectCallback, useEffect } from "react";

import { useIsFirstRender } from "src/hooks/useIsFirstRender";

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (!isFirstRender) {
      return effect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
