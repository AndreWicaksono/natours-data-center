import { useState } from "react";

import { useUpdateEffect } from "src/hooks/useUpdateEffect";

export function useDebounce<T>(
  value: T,
  delay?: number
): { isLoading: boolean | null; value: T } {
  const [debouncedValue, setDebouncedValue] = useState<{
    isLoading: boolean | null;
    value: T;
  }>({ isLoading: null, value });

  useUpdateEffect(() => {
    setDebouncedValue((prevState) => ({ ...prevState, isLoading: true }));

    const timer = setTimeout(() => {
      setDebouncedValue({ isLoading: false, value });
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
