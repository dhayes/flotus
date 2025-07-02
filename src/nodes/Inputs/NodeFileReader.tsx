import React, { useContext, useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Draggable from "react-draggable";
import * as dfd from "danfojs";
import { ConnectionContext } from "@/Connections";
import type { Point } from "@/types";
import { StageContext } from "@/Stage";

interface NodeProps {
  label: string;
  width?: number;
  setAddDependencyFunction: React.Dispatch<
    React.SetStateAction<((id: string, f: (value: any) => void) => void) | undefined>
  >;
  addDependencyFunction: ((id: string, f: (value: any) => void) => void) | undefined;
  setRemoveDependencyFunction: React.Dispatch<
    React.SetStateAction<((id: string) => void) | undefined>
  >;
  removeDependencyFunction: ((id: string) => void) | undefined;
  setUpdateInputFunction: (value: any) => void;
  setSelectedInputId: (id: string | null) => void;
  setSelectedOutputId: (id: string | null) => void;
  selectedInputId: string | null;
  selectedOutputId: string | null;
  style?: React.CSSProperties;
}

const NodeFileReader: React.FC<NodeProps> = ({
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
  style
}) => {
  const { startConnection, finishConnection, updatePortPosition } = useContext(ConnectionContext);
  const {offsetX, offsetY, scale} = useContext(StageContext);

  const outputId = useId();
  const nodeRef = useRef<any>(null);
  const portRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [df, setDf] = useState<dfd.DataFrame | null>(null);
  const [filename, setFilename] = useState<string>("");

  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const [dependencies, setDependencies] = useState<Record<string, (v: any) => void>>({});

  const addDependency = (id: string, f: (v: any) => void) => {
    if (df) f(df);
    setDependencies((prev) => ({ ...prev, [id]: f }));
  };

  const removeDependency = (id: string) => {
    setDependencies((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const updatePortPositions = () => {
    Object.entries(portRefs.current).forEach(([id, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const center: Point = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        updatePortPosition(id, center);
      }
    });
  };

  const onDragHandler = () => {
    updatePortPositions();
  };

  useEffect(() => {
    updatePortPositions();
  }, []);

      useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            if (!nodeRef.current?.contains(e.target as Node)) {
                setAddDependencyFunction(undefined)
                setRemoveDependencyFunction(undefined)
                setUpdateInputFunction(undefined)
                setSelectedInputId(null)
                setSelectedOutputId(null)
            }
        };
        updatePortPositions();
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [offsetX, offsetY, scale]);


  useEffect(() => {
    if (df) {
      Object.values(dependencies).forEach((f) => f(df));
    }
  }, [df]);

  const handleFile = async (file: File) => {
    try {
      setFilename(file.name);
      const loadedDf = await dfd.readCSV(file);
      setDf(loadedDf);
    } catch (err) {
      console.error("Failed to read file", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // Drag & Drop events
  useEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer!.dropEffect = "copy";
      setIsDragging(true);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFile(file);
    };

    drop.addEventListener("dragenter", handleDragEnter);
    drop.addEventListener("dragleave", handleDragLeave);
    drop.addEventListener("dragover", handleDragOver);
    drop.addEventListener("drop", handleDrop);

    return () => {
      drop.removeEventListener("dragenter", handleDragEnter);
      drop.removeEventListener("dragleave", handleDragLeave);
      drop.removeEventListener("dragover", handleDragOver);
      drop.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <Draggable
      defaultClassName="inline-block draggable-item absolute"
      nodeRef={nodeRef}
      onDrag={onDragHandler}
      onStop={onDragHandler}
      cancel="button"
    >
      <div ref={nodeRef} style={style}>
        <Card
          className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-0 !shadow-none !border-none"
          style={width ? { width: `${width}px` } : { width: "220px" }}
        >
          <CardHeader className="bg-[#3b3f42] text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
            {label}
          </CardHeader>
          <CardContent className="py-4 px-0 bg-[#696f72]">
            <div className="flex flex-col gap-4 px-4" ref={dropRef}>
              <div
                className={`border-dashed border-2 rounded p-4 text-sm text-white text-center transition ${
                  isDragging ? "border-blue-400 bg-blue-900/20" : "border-gray-400"
                }`}
              >
                {isDragging
                  ? "Drop your CSV file here"
                  : filename
                  ? `Loaded: ${filename}`
                  : "Drag & drop a CSV/TSV file or click below"}
              </div>

              <Input type="file" accept=".csv,.tsv" onChange={handleFileChange} />

              <div className="self-end text-right flex !ml-0 pl-0">
                <div className="text-white text-sm font-mono mr-2">DF</div>
                <div
                  className="!mr-0 !px-2 flex items-center"
                  ref={(el) => {
                    portRefs.current[outputId] = el;
                  }}
                >
                  <button
                    className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full !bg-gray-${
                      df ? "600" : "900"
                    } !hover:bg-gray-700 !p-0 !border-0 cursor-pointer`}
                    aria-label="Output port"
                    onMouseDown={() => {
                      startConnection(outputId);
                      setSelectedOutputId(outputId);
                      setAddDependencyFunction(() => (id, f) => addDependency(id, f));
                      setRemoveDependencyFunction(() => removeDependency);
                    }}
                    onMouseUp={() => {
                      finishConnection(outputId);
                      setAddDependencyFunction(undefined);
                      setRemoveDependencyFunction(undefined);
                      setUpdateInputFunction(undefined);
                      setSelectedInputId(null);
                      setSelectedOutputId(null);
                    }}
                  ></button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Draggable>
  );
};

export default React.memo(NodeFileReader);
