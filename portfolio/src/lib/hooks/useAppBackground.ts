import { useState, useEffect } from "react";

export function useAppBackground() {
  const [bgStyle, setBgStyle] = useState<string>("");

  useEffect(() => {
    if (bgStyle) {
      document.body.style.background = bgStyle;
    } else {
      document.body.style.background = "";
    }
  }, [bgStyle]);

  function setBackground(style: string) {
    setBgStyle(style);
  }

  function clearBackground() {
    setBgStyle("");
  }

  return { bgStyle, setBackground, clearBackground };
}
