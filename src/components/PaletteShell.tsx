import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./CommandPalette.css";

// A persistent panel chrome that smoothly animates its height as the inner
// content swaps (e.g. command palette -> repo picker).
export function PaletteShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [h, setH] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => {
      const node = innerRef.current;
      if (node) setH(node.offsetHeight + 2); // +2 for top/bottom border
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // Re-measure once the web font is ready so the panel doesn't settle short.
    document.fonts?.ready.then(update).catch(() => {});
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`palette ${className}`} style={{ height: h }}>
      <div className="palette-inner" ref={innerRef}>
        {children}
      </div>
    </div>
  );
}
