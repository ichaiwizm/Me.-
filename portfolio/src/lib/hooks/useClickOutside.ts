import React from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
): void {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handler]);
}
