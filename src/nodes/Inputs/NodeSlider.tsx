import React, { useContext, useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import Draggable, { type DraggableData, type DraggableEvent } from "react-draggable";
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

const SliderNode: React.FC<NodeProps> = ({
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
  const { startConnection, finishConnection, updatePortPosition, deleteConnection, moveEndPoint } =
    useContext(ConnectionContext);

  const { offsetX, offsetY, scale } = useContext(StageContext);

  const inputId = useId();
  const outputId = useId();
  const nodeRef = useRef<any>(null);
  const portRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [value, setValue] = useState<number>(50);
  const [connected, setConnected] = useState<string | null>(null);

  const [dependencies, setDependencies] = useState<Record<string, (v: any) => void>>({});

  useEffect(() => {
    updatePortPositions();
  }, []);

  const addDependency = (id: string, f: (v: any) => void) => {
    f(value);
    setDependencies((prev) => ({ ...prev, [id]: f }));
  };

  const removeDependency = (id: string) => {
    setDependencies((prev) => {
      const newDeps = { ...prev };
      delete newDeps[id];
      return newDeps;
    });
  };

  useEffect(() => {
    Object.values(dependencies).forEach((f) => f(value));
  }, [value]);



  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (!nodeRef.current?.contains(e.target as Node)) {
        setAddDependencyFunction(undefined)
        setRemoveDependencyFunction(undefined)
        setUpdateInputFunction(undefined)
        setSelectedInputId(null)
        setSelectedOutputId(null)
        finishConnection(null)
      }
    };
    updatePortPositions();

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    updatePortPositions();
  }, [offsetX, offsetY, scale]);

  const updatePortPositions = (x = 0, y = 0) => {
    Object.entries(portRefs.current).forEach(([id, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const center: Point = {
          x: rect.left + (rect.width / 2),
          y: rect.top + (rect.height / 2),
        };
        updatePortPosition(id, center);
      }
    });
  };

  const onDragHandler = (e: DraggableEvent, data: DraggableData) => {
    updatePortPositions(data.x, data.y);
  };

  return (
    <Draggable
      defaultClassName="inline-block draggable-item absolute"
      nodeRef={nodeRef}
      onDrag={(e, data) => onDragHandler(e, data)}
      onStop={onDragHandler}
      cancel="button"
    >
      <div ref={nodeRef} style={style}>
        <Card
          className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-0 !shadow-none !border-none"
          style={width ? { width: `${width}px` } : { width: "200px" }}
        >
          <CardHeader className="bg-[#3b3f42] text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
            {label}
          </CardHeader>
          <CardContent className="py-4 px-0 bg-[#696f72]">
            <div className="flex flex-col items-stretch gap-4 text-justify">
              {/* Slider */}
              <div className="px-4">
                <Slider
                  max={10}
                  step={0.1}
                  value={[value]}
                  onValueChange={([v]) => {
                    setValue(v);
                  }}
                />
              </div>
              {/* Output */}
              <div className="self-end text-right flex !ml-0 pl-0">
                <div>
                  <input
                    className="w-1/3 py-0 px-2 bg-white text-black rounded"
                    type="text"
                    value={value}
                    readOnly
                  />
                </div>
                <div
                  className="!mr-0 !px-2 flex items-center"
                  ref={(el) => {
                    portRefs.current[outputId] = el;
                  }}
                >
                  <button
                    className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full !bg-gray-${Object.keys(dependencies).length > 0 ? "600" : "900"
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

export default React.memo(SliderNode);
