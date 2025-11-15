// BottomPanel.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, ChevronDown, ChevronDownIcon, CircleArrowUpIcon } from "lucide-react";
import { useNodeEngine } from "./NodeEngineContext";
import * as dfd from "danfojs";
import { DataFrameViewer } from "./components/ui/DataFrameViewer";

interface BottomPanelProps {
  sidebarWidth: number;
}

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 500;

export function BottomPanel({ sidebarWidth }: BottomPanelProps) {
  const [height, setHeight] = useState(250);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const { selectedNode } = useNodeEngine()

  const df =
    selectedNode?.outputType === "dataframe"
      ? (selectedNode.outputValue as dfd.DataFrame)
      : null

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const stopDrag = () => setIsDragging(false);

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    const newHeight = window.innerHeight - e.clientY;
    setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, newHeight)));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", stopDrag);
      document.body.style.cursor = "ns-resize";
    } else {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
      document.body.style.cursor = "default";
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
      document.body.style.cursor = "default";
    };
  }, [isDragging]);

  useEffect(() => {
    if (df && isCollapsed) setIsCollapsed(false)
  }, [df])

  return (
    <div
      ref={panelRef}
      className={`select-none fixed bottom-0 right-0 bg-zinc-900 text-white border-t border-gray-700 transition-all ${isCollapsed ? "h-8" : ""
        }`}
      style={{
        height: isCollapsed ? "32px" : `${height}px`,
        left: `${sidebarWidth}px`,
      }}
    >
      {/* Drag Handle */}
      <div
        onMouseDown={startDrag}
        className="h-2 cursor-ns-resize bg-gray-600 hover:bg-gray-400"
      />

      {/* Header / Collapse toggle */}
      <div className="flex items-center justify-between text-gray-200 !hover:!text-gray-200 border-none px-3 h-8">
        <div />
        <Button className="
        !bg-transparent
        !hover:!bg-transparent
        !ring-0
        !hover:!ring-0
        !border-0
        !hover:!border-0
        !hover:text-gray-200
        !text-gray-200
        " variant="outline" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </Button>
      </div>


      {/* Panel Content */}
      {!isCollapsed && (
        <div className="p-2 h-[calc(100%-32px)] overflow-hidden">
          {df ? (
            <div className="h-full w-full draggable-item">
              <DataFrameViewer df={df} />
            </div>
          ) : (
            <div className="text-gray-400 text-sm italic">No DataFrame selected</div>
          )}
        </div>
      )
      }
    </div >
  );
}
