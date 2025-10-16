import React, { useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import * as dfd from "danfojs";

type Props = {
  df: dfd.DataFrame;
  rowHeight?: number;
  headerHeight?: number;
  minColWidth?: number;
  dynamicHeight?: number; // optional override for height
};

function formatCell(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "number" && Number.isNaN(v)) return "NaN";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

function useResize(elRef: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setSize({ w: Math.max(0, cr.width), h: Math.max(0, cr.height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [elRef]);
  return size;
}

const FastDataTable: React.FC<Props> = ({
  df,
  rowHeight = 28,
  headerHeight = 32,
  minColWidth = 120,
  dynamicHeight,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const { w: containerWidth, h: observedHeight } = useResize(outerRef);
  const containerHeight = dynamicHeight ?? observedHeight;

  const columns: string[] = useMemo(() => {
    return (df as any).$columns ?? (df as any).columns ?? [];
  }, [df]);

  const values: unknown[][] = useMemo(() => {
    const v = (df as any).$data ?? (df as any).values;
    return Array.isArray(v) ? v : [];
  }, [df]);

  const { colWidth, totalWidth } = useMemo(() => {
    if (!columns.length) return { colWidth: minColWidth, totalWidth: 0 };
    const stretchWidth = Math.floor(containerWidth / Math.max(1, columns.length));
    const widthPerCol = Math.max(minColWidth, stretchWidth);
    const total = Math.max(containerWidth, widthPerCol * columns.length);
    return { colWidth: widthPerCol, totalWidth: total };
  }, [columns.length, containerWidth, minColWidth]);

  const bodyHeight = Math.max(0, containerHeight - headerHeight);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const row = values[index] ?? [];
    return (
      <div style={{ ...style, display: "flex" }} className="border-b border-gray-200">
        {columns.map((c, i) => (
          <div
            key={`${index}-${i}`}
            style={{
              width: colWidth,
              padding: "0 8px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: `${rowHeight}px`,
            }}
            className="border-r border-gray-100"
            title={formatCell(row[i])}
          >
            {formatCell(row[i])}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={outerRef}
      className="w-full h-full overflow-x-auto rounded bg-[#ffffff]"
      style={{ height: containerHeight || 240 }}
    >
      <div style={{ width: totalWidth }}>
        <div
          className="flex border-b border-gray-300 bg-muted/40 sticky top-0 z-10"
          style={{
            height: headerHeight,
            lineHeight: `${headerHeight}px`,
          }}
        >
          {columns.map((c) => (
            <div
              key={c}
              className="select-none font-medium text-xs"
              style={{
                width: colWidth,
                padding: "0 8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={c}
            >
              {c}
            </div>
          ))}
        </div>

        <div className="overflow-y-auto" style={{ height: bodyHeight }}>
          <List
            height={bodyHeight}
            itemCount={values.length}
            itemSize={rowHeight}
            width={totalWidth}
            overscanCount={6}
          >
            {Row}
          </List>
        </div>
      </div>
    </div>
  );
};

export default FastDataTable;
