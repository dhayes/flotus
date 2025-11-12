import React, { useMemo, useRef, useLayoutEffect, useState } from "react"
import * as dfd from "danfojs"
import { DataGrid } from "react-data-grid"
import "react-data-grid/lib/styles.css"

export function DataFrameViewer({ df }: { df: dfd.DataFrame }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  // Update container width on resize
  useLayoutEffect(() => {
    const updateWidth = () => setContainerWidth(containerRef.current?.offsetWidth ?? 0)
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const rows = useMemo(() => dfd.toJSON(df) as Record<string, any>[], [df])

  // Compute dynamic column widths
  const columns = useMemo(() => {
    if (!containerWidth || df.columns.length === 0) {
      return df.columns.map((c) => ({ key: c, name: c, resizable: true, width: 120 }))
    }

    const baseWidth = 120
    const totalWidth = baseWidth * df.columns.length
    if (totalWidth >= containerWidth) {
      // Use fixed widths, scroll enabled
      return df.columns.map((c) => ({ key: c, name: c, resizable: true, width: baseWidth }))
    }

    // Stretch columns evenly to fill available width
    const stretched = Math.floor(containerWidth / df.columns.length)
    return df.columns.map((c) => ({ key: c, name: c, resizable: true, width: stretched }))
  }, [df.columns, containerWidth])

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto select-none"
      style={{
        backgroundColor: "#1e1e1e",
        color: "#f0f0f0",
        userSelect: "none",
      }}
    >
      <div className="min-w-max">
        <DataGrid
          columns={columns}
          rows={rows}
          className="rdg-light"
          style={{
            height: "100%",
            minWidth: "100%",
          }}
        />
      </div>
    </div>
  )
}
