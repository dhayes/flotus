// NodeInfoSummary.tsx
import React, { useContext, useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Draggable from "react-draggable";
import * as dfd from "danfojs";
import { ConnectionContext } from "@/Connections";
import { StageContext } from "@/Stage";
import type { Point } from "@/types";

type Input = {
    id: string;
    value: any;
    connected: string | null;
    removeDependencyFunction?: (id: string) => void;
    addDependencyFunction?: (id: string, f: (value: any) => void) => void;
};

const NodeInfoSummary: React.FC<any> = ({
    label,
    width,
    setAddDependencyFunction,
    addDependencyFunction,
    setRemoveDependencyFunction,
    removeDependencyFunction,
    setUpdateInputFunction,
    setSelectedInputId,
    setSelectedOutputId,
    selectedInputId,
    selectedOutputId,
    style,
}) => {
    const { updatePortPosition, startConnection, finishConnection, moveEndPoint } = useContext(ConnectionContext);
    const { offsetX, offsetY, scale } = useContext(StageContext);

    const nodeRef = useRef<HTMLDivElement>(null);
    const portRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const inputId = useId();

    const [inputs, setInputs] = useState<Input[]>([
        { id: inputId, value: null, connected: null },
    ]);

    const [summary, setSummary] = useState<string[][]>([]);

    const updateInput = (index: number, changes: Partial<Input>) => {
        setInputs((prev) => prev.map((inp, i) => (i === index ? { ...inp, ...changes } : inp)));
    };

    const updatePortPositions = () => {
        Object.entries(portRefs.current).forEach(([id, el]) => {
            if (el) {
                const rect = el.getBoundingClientRect();
                updatePortPosition(id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }
        });
    };

    useEffect(() => updatePortPositions(), [offsetX, offsetY, scale]);

    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            if (!nodeRef.current?.contains(e.target as Node)) {
                setAddDependencyFunction(undefined);
                setRemoveDependencyFunction(undefined);
                setUpdateInputFunction(undefined);
                setSelectedInputId(null);
                setSelectedOutputId(null);
                finishConnection(null);
            }
        };
        document.addEventListener("mouseup", handleMouseUp);
        return () => document.removeEventListener("mouseup", handleMouseUp);
    }, []);

    const [df, setDf] = useState<dfd.DataFrame | null>(null);

    useEffect(() => {
        inputs[0]?.value && inputs[0]?.value?.shape[0] > 0 && setDf(inputs[0].value)
    }, inputs)

    useEffect(() => {
        console.log("inputs", inputs)
        console.log(df)
        if (df && df?.shape && df.shape[0] > 0) {
            try {
                const rows = df.shape[0];
                const cols = df.shape[1];
                const names = df?.columns ?? [];
                const types = names.map(name => df.column(name).dtype);

                const stats = df?.dropNa()?.describe();
                const headers = ["Column", "Type", "Min", "Max", "Mean"];
                const summaryData = names.map((name, i) => {
                    const colStats = stats?.loc({ columns: [name] })?.$values.map(row => row[0]);
                    return [
                        name,
                        types[i] || "-",
                        colStats[3]?.toString() ?? "-",
                        colStats[7]?.toString() ?? "-",
                        colStats[1]?.toString() ?? "-",
                    ];
                });
                setSummary([[`Rows: ${rows}`, `Columns: ${cols}`], headers, ...summaryData]);
            } catch (e) {
                console.warn("Failed to compute summary:", e);
                setSummary([]);
            }
        } else {
            setSummary([]);
        }
    }, [df]);

    return (
        <Draggable
            defaultClassName="inline-block draggable-item absolute"
            nodeRef={nodeRef}
            onDrag={updatePortPositions}
            onStop={updatePortPositions}
            cancel="button"
        >
            <div ref={nodeRef} style={style}>
                <Card
                    className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-0 !shadow-none !border-none"
                    style={width ? { width: `${width}px` } : { width: "320px" }}
                >
                    <CardHeader className="bg-[#3b3f42] text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
                        {label}
                    </CardHeader>
                    <CardContent className="pt-3 pb-4 px-0 bg-[#696f72]">
                        <div className="flex flex-col gap-4 px-4">
                            {inputs.map((inp, i) => {
                                const updateInputFunction = () => (value: any) => {
                                    updateInput(i, { value });
                                };
                                return (

                                    <div key={inp.id} className="self-start flex items-center !mr-0 pr-0">
                                        <div
                                            className="!ml-0 !px-0 flex items-center"
                                            ref={(el) => {
                                                portRefs.current[inp.id] = el;
                                            }}
                                        >
                                            <button
                                                className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full ${inp.connected ? "!bg-gray-400" : "!bg-gray-600"
                                                    } !p-0 !border-0 !cursor-pointer`}
                                                aria-label="Input port"
                                                onMouseUp={() => {
                                                    setSelectedInputId(inp.id);
                                                    setUpdateInputFunction(updateInputFunction);
                                                    finishConnection(inp.id);
                                                    updateInput(i, { connected: selectedOutputId });
                                                    if (addDependencyFunction && removeDependencyFunction) {
                                                        updateInput(i, {
                                                            addDependencyFunction,
                                                            removeDependencyFunction,
                                                        });
                                                    }
                                                }}
                                                onMouseDown={() => {
                                                    setSelectedOutputId(inp.connected);
                                                    setSelectedInputId(inp.id);
                                                    if (inp.removeDependencyFunction && inp.addDependencyFunction) {
                                                        inp.removeDependencyFunction(inp.id);
                                                        inp.connected && setRemoveDependencyFunction(() => inp.removeDependencyFunction!);
                                                        inp.connected && setAddDependencyFunction(() => inp.addDependencyFunction!);
                                                        inp.connected && moveEndPoint(inp.id);
                                                        updateInput(i, { connected: null });
                                                    }
                                                }}
                                            ></button>
                                        </div>
                                    </div>
                                )
                            })}
                            {summary.length > 0 && (() => {console.log(summary); return true})() && (
                                <div className="text-white text-xs font-mono overflow-x-auto">
                                    {summary.map((row, i) => (
                                        <div key={i} className="flex flex-wrap gap-2">
                                            {row.map((cell, j) => (
                                                <div key={j} className="whitespace-nowrap">
                                                    {cell}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Draggable>
    );
};

export default React.memo(NodeInfoSummary);
