// useSidebarWidth.ts
import { useEffect, useState } from "react";

export function useSidebarWidth() {
  const [sidebarWidth, setSidebarWidth] = useState(0);

  useEffect(() => {
    const sidebar = document.querySelector('[data-sidebar="true"]') as HTMLElement | null;
    if (!sidebar) return;
    const observer = new ResizeObserver(([entry]) =>
      setSidebarWidth(entry.contentRect.width)
    );
    observer.observe(sidebar);
    return () => observer.disconnect();
  }, []);

  return sidebarWidth;
}
