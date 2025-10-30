import { useEffect, useState } from "react";

const UA_REGEX = /Mobi|Android|iPhone|iPad|iPod|IEMobile|BlackBerry/i;

export function useMobile(breakpointPx: number = 820) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqWidth = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const mqCoarse = window.matchMedia("(pointer: coarse)");

    const compute = () =>
      mqWidth.matches || mqCoarse.matches || UA_REGEX.test(navigator.userAgent);

    const update = () => setIsMobile(compute());

    update();
    mqWidth.addEventListener("change", update);
    mqCoarse.addEventListener("change", update);
    return () => {
      mqWidth.removeEventListener("change", update);
      mqCoarse.removeEventListener("change", update);
    };
  }, [breakpointPx]);

  return isMobile;
}
