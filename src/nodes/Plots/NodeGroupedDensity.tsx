import React, { useContext, useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Draggable from "react-draggable";
import * as dfd from "danfojs";
import { ConnectionContext } from "@/Connections";
import { StageContext } from "@/Stage";
import type { Point } from "@/types";

interface Input {
  id: string;
  value: any;
  connected: string | null;
  removeDependencyFunction?: (id: string) => void;
  addDependencyFunction?: (id: string, f: (value: any) => void) => void;
}

interface NodeProps {
  id: string;
  label: string;
  width?: number;
  setAddDependencyFunction: React.Dispatch<
    React.SetStateAction<((id: string, f: (value: any) => void) => void) | undefined>
  >;
  addDependencyFunction?: (id: string, f: (value: any) => void) => void;
  setRemoveDependencyFunction: React.Dispatch<
    React.SetStateAction<((id: string) => void) | undefined>
  >;
  removeDependencyFunction?: (id: string) => void;
  setUpdateInputFunction: (value: any) => void;
  setSelectedInputId: (id: string | null) => void;
  setSelectedOutputId: (id: string | null) => void;
  selectedInputId: string | null;
  selectedOutputId: string | null;
  style?: React.CSSProperties;
}

const NodeSelectColumns: React.FC<NodeProps> = ({
  id,
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
  const { startConnection, finishConnection, updatePortPosition, moveEndPoint } = useContext(ConnectionContext);
  const { offsetX, offsetY, scale } = useContext(StageContext);

  const portRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const nodeRef = useRef<any>(null);
  const outputId = useId();

  const [columns, setColumns] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [invert, setInvert] = useState(false);

  const [inputs, setInputs] = useState<Input[]>([{
    id: useId(),
    value: null,
    connected: null,
    removeDependencyFunction: undefined,
    addDependencyFunction: undefined,
  }]);

  const [output, setOutput] = useState({
    id: outputId,
    value: null,
    connected: null,
  });

  const [dependencies, setDependencies] = useState<Record<string, ((value: any) => void)>>({});

  const updateInput = (
    index: number,
    changes: Partial<Pick<Input, 'value' | 'connected' | 'addDependencyFunction' | 'removeDependencyFunction'>>
  ) => setInputs(prev => prev.map((inp, i) => i === index ? { ...inp, ...changes } : inp));

  const updateOutput = () => {
    const df = inputs[0].value;
    if (!df || !(df instanceof dfd.DataFrame)) return;
    const colsToUse = invert
      ? df.columns.filter(col => !selected.has(col))
      : df.columns.filter(col => selected.has(col));
    const filtered = df.loc({ columns: colsToUse });
    setOutput(prev => ({ ...prev, value: filtered }));
  };

  const addDependency = (id: string, f: (value: any) => void) => {
    f(output.value);
    setDependencies(prev => ({ ...prev, [id]: f }));
  };

  const removeDependency = (id: string) => {
    setDependencies(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const makeAddDependencyFunction = () => (id: string, f: (value: any) => void) => addDependency(id, f);
  const makeRemoveDependencyFunction = () => (id: string) => removeDependency(id);

  const updateAllPortPositions = () => {
    Object.entries(portRefs.current).forEach(([portId, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const center: Point = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        updatePortPosition(portId, center);
      }
    });
  };

  const onMouseDownPort = (portId: string) => {
    startConnection(portId);
  };

  const onMouseUpPort = (portId: string) => {
    finishConnection(portId);
  };

  useEffect(() => {
    updateOutput();
  }, [inputs, selected, invert]);

  useEffect(() => {
    Object.values(dependencies).forEach(f => f(output.value));
  }, [output.value]);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (!nodeRef.current?.contains(e.target as Node)) {
        setAddDependencyFunction(undefined);
        setRemoveDependencyFunction(undefined);
        setUpdateInputFunction(undefined);
        setSelectedInputId(null);
        setSelectedOutputId(null);
        finishConnection(null);
        updateAllPortPositions();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [offsetX, offsetY, scale]);

  useEffect(() => {
    updateAllPortPositions();
  }, []);

  useEffect(() => {
    const df = inputs[0].value;
    if (df instanceof dfd.DataFrame) {
      setColumns(df.columns);
      setSelected(new Set(df.columns));
    }
  }, [inputs[0].value]);

  const toggleColumn = (col: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(col) ? next.delete(col) : next.add(col);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(columns));
  };

  const deselectAll = () => {
    setSelected(new Set());
  };

  const toggleInvert = () => {
    setInvert(i => !i);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultClassName="inline-block draggable-item absolute"
      onDrag={updateAllPortPositions}
      onStop={updateAllPortPositions}
      cancel="button,input"
    >
      <div ref={nodeRef} style={style}>
        <Card
          className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-0 !shadow-none !border-none"
          style={width ? { width: `${width}px` } : { width: "240px" }}
        >
          <CardHeader className="bg-[#3b3f42] text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
            {label}
          </CardHeader>
          <CardContent className="py-4 px-0 bg-[#696f72]">
            <div className="flex flex-col items-stretch gap-3 text-justify px-4">
              {inputs.map((input, index) => {
                const updateInputFunction = () => (value: any) => {
                  updateInput(index, { value });
                };
                return (
                  <div
                    key={input.id}
                    className="self-start text-left flex !mr-0 pr-0"
                  >
                    <div
                      className="!ml-0 !px-0 flex items-center"
                      ref={(el) => {
                        portRefs.current[input.id] = el;
                      }}
                    >
                      <button
                        className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full ${input.connected ? '!bg-gray-400' : '!bg-gray-600'} !p-0 !border-0 !cursor-pointer`}
                        aria-label="Circle button"
                        onMouseUp={() => {
                          setSelectedInputId(input.id);
                          setUpdateInputFunction(updateInputFunction);
                          onMouseUpPort(input.id);
                          updateInput(index, { value: input.value });
                          updateInput(index, { connected: selectedOutputId });
                          if (addDependencyFunction && removeDependencyFunction) {
                            updateInput(index, { addDependencyFunction });
                            updateInput(index, { removeDependencyFunction });
                          }
                        }}
                        onMouseDown={() => {
                          setSelectedOutputId(input.connected);
                          setSelectedInputId(input.id);
                          if (input.removeDependencyFunction && input.addDependencyFunction) {
                            input.removeDependencyFunction(input.id);
                            input.connected && setRemoveDependencyFunction(() => input.removeDependencyFunction);
                            input.connected && setAddDependencyFunction(() => input.addDependencyFunction);
                            input.connected && moveEndPoint(input.id);
                            updateInput(index, { connected: null });
                          }
                        }}
                      ></button>
                    </div>
                  </div>
                );
              })}

              {/* Column Selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-white text-black h-8 text-xs">Select Columns</Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 max-h-64 overflow-auto">
                  <div className="flex flex-col gap-1">
                    {columns.map((col) => (
                      <label key={col} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={selected.has(col)}
                          onCheckedChange={() => toggleColumn(col)}
                        />
                        {col}
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-1 text-[10px] text-white">
                <Button onClick={selectAll} size="sm" className="h-6 px-2 text-xs">All</Button>
                <Button onClick={deselectAll} size="sm" className="h-6 px-2 text-xs">None</Button>
                <Button onClick={toggleInvert} size="sm" className="h-6 px-2 text-xs">{invert ? "Omit" : "Include"}</Button>
              </div>

              {/* Output */}
              <div className="self-end text-right flex !ml-0 pl-0">
                <div className="text-white text-sm font-mono mr-2">DF</div>
                <div
                  className="!mr-0 !px-2 flex items-center"
                  ref={(el) => {
                    portRefs.current[output.id] = el;
                  }}
                >
                  <button
                    className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full ${Object.keys(dependencies).length > 0 ? '!bg-gray-400' : '!bg-gray-600'} !p-0 !border-0 !cursor-pointer`}
                    aria-label="Output port"
                    onMouseDown={() => {
                      onMouseDownPort(output.id);
                      setSelectedOutputId(output.id);
                      setAddDependencyFunction(makeAddDependencyFunction);
                      setRemoveDependencyFunction(makeRemoveDependencyFunction);
                    }}
                    onMouseUp={() => {
                      finishConnection(output.id);
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

export default React.memo(NodeSelectColumns);
