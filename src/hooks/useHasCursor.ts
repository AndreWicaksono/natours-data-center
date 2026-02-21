import { useEffect, useState } from "react";

/**
 * Hook to detect if the device has cursor (mouse) capability
 *
 * Returns true for:
 * - Desktop computers with mouse
 * - Laptops with trackpad
 *
 * Returns false for:
 * - Touch-only devices (phones, tablets)
 * - Devices without precise pointer (coarse pointer)
 *
 * Useful for:
 * - Showing/hiding hover-dependent UI elements
 * - Adapting interactions for touch vs mouse
 * - Improving accessibility on different devices
 */
export const useHasCursor = (): boolean => {
  const [hasCursor, setHasCursor] = useState(true); // Default to true for SSR

  useEffect(() => {
    // Check if media queries are supported
    if (typeof window === "undefined" || !window.matchMedia) {
      setHasCursor(true);
      return;
    }

    /**
     * Media query to detect fine pointer (mouse/trackpad)
     * - 'pointer: fine' = device has precise pointing device (mouse, trackpad)
     * - 'pointer: coarse' = device has imprecise pointing device (finger on touchscreen)
     * - 'pointer: none' = device has no pointing device
     */
    const finePointerQuery = window.matchMedia("(pointer: fine)");

    /**
     * Media query to detect hover capability
     * - 'hover: hover' = device can hover (mouse)
     * - 'hover: none' = device cannot hover (touch)
     */
    const hoverQuery = window.matchMedia("(hover: hover)");

    /**
     * Check both conditions:
     * 1. Device has fine pointer (mouse/trackpad)
     * 2. Device can hover
     *
     * This combination reliably detects cursor-based devices
     */
    const checkHasCursor = () => {
      const hasFinePointer = finePointerQuery.matches;
      const canHover = hoverQuery.matches;

      setHasCursor(hasFinePointer && canHover);
    };

    // Initial check
    checkHasCursor();

    // Listen for changes (e.g., connecting/disconnecting mouse on tablet)
    const handleChange = () => checkHasCursor();

    // Modern browsers
    if (finePointerQuery.addEventListener) {
      finePointerQuery.addEventListener("change", handleChange);
      hoverQuery.addEventListener("change", handleChange);
    }
    // Fallback for older browsers
    else if (finePointerQuery.addListener) {
      finePointerQuery.addListener(handleChange);
      hoverQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (finePointerQuery.removeEventListener) {
        finePointerQuery.removeEventListener("change", handleChange);
        hoverQuery.removeEventListener("change", handleChange);
      } else if (finePointerQuery.removeListener) {
        finePointerQuery.removeListener(handleChange);
        hoverQuery.removeListener(handleChange);
      }
    };
  }, []);

  return hasCursor;
};
