import React, { useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import * as dfd from "danfojs";


const FastDataTable = ({ df }: { df: dfd.DataFrame }) => {
    // Define initial column widths
    const getInitialWidths = (columns: string[]) =>
        Object.fromEntries(columns.map((col) => [col, 150]));

    const containerRef = useRef<HTMLDivElement>(null);
    const columns = df.$columns;
    const [columnWidths, setColumnWidths] = useState(() => getInitialWidths(columns));
    const resizingColumnRef = useRef<string | null>(null);

    const handleMouseDown = (col: string) => (e: React.MouseEvent) => {
        resizingColumnRef.current = col;
        const startX = e.clientX;
        const startWidth = columnWidths[col];

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = startWidth + (e.clientX - startX);
            setColumnWidths((prev) => ({
                ...prev,
                [col]: Math.max(newWidth, 60),
            }));
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            resizingColumnRef.current = null;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        // const rowDf = df.iloc({ rows: [index] });
        // const row = columns.map((col) => rowDf.column(col).values[0]);
        const row = df.$data[index];
        return (
            <div style={{ ...style, display: "flex" }} className="border-b border-gray-200 hover:bg-gray-100">
                {columns.map((col, i) => (
                    <div
                        key={i}
                        style={{
                            width: columnWidths[col],
                            flexShrink: 0,
                            padding: "0.5rem",
                            borderRight: "1px solid #e5e7eb",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {String(row[i])}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div
            className="rounded bg-white text-black text-sm max-h-[200px] overflow-auto border border-gray-200"
            ref={containerRef}
        >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white font-bold border-b border-gray-300 flex">
                {columns.map((col) => (
                    <div
                        key={col}
                        style={{
                            width: columnWidths[col],
                            flexShrink: 0,
                            padding: "0.5rem",
                            borderRight: "1px solid #e5e7eb",
                            position: "relative",
                            userSelect: "none",
                        }}
                        className="truncate"
                    >
                        {col}
                        {/* Resize Handle */}
                        <div
                            onMouseDown={handleMouseDown(col)}
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                height: "100%",
                                width: "5px",
                                cursor: "col-resize",
                                zIndex: 20,
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Virtualized Body */}
            <List
                height={160}
                itemCount={df.shape[0]}
                itemSize={32}
                width="100%"
            >
                {renderRow}
            </List>
        </div>
    );
};

export default FastDataTable;
