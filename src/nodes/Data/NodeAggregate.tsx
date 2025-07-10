// NodeGroupByAggregate.tsx
import React, { useContext, useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Draggable from "react-draggable";
import * as dfd from "danfojs";
import { ConnectionContext } from "@/Connections";
import { StageContext } from "@/Stage";
import type { Point } from "@/types";

const AGG_FUNCS = ["sum", "mean", "count", "min", "max"];

const NodeGroupByAggregate: React.FC<any> = ({
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
  const outputId = useId();

  type Input = {
    id: string;
    value: any;
    connected: string | null;
    removeDependencyFunction?: (id: string) => void;
    addDependencyFunction?: (id: string, f: (value: any) => void) => void;
  };

  const inputsData: Input[] = [
    { id: inputId, value: null, connected: null }
  ];
  const [inputs, setInputs] = useState(inputsData);

  const [output, setOutput] = useState<{ id: string; value: dfd.DataFrame | null; connected: string | null }>({
    id: outputId,
    value: null,
    connected: null,
  });
  const [dependencies, setDependencies] = useState<Record<string, (v: any) => void>>({});

  const [groupByCols, setGroupByCols] = useState<string[]>([]);
  const [valueCol, setValueCol] = useState<string>("");
  const [aggFunc, setAggFunc] = useState<string>("sum");

  const updateInput = (index: number, changes: Partial<Input>) => {
    setInputs(prev => prev.map((inp, i) => i === index ? { ...inp, ...changes } : inp));
  };

  const updatePortPositions = () => {
    Object.entries(portRefs.current).forEach(([id, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        updatePortPosition(id, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    });
  };

  useEffect(() => {
    updatePortPositions();
  }, [offsetX, offsetY, scale]);

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

  const addDependency = (id: string, f: (v: any) => void) => {
    f(output.value);
    setDependencies(prev => ({ ...prev, [id]: f }));
  };

  const removeDependency = (id: string) => {
    setDependencies(prev => {
      const cp = { ...prev };
      delete cp[id];
      return cp;
    });
  };

  useEffect(() => {
    const df = inputs[0].value;
    if (df?.shape && groupByCols.length > 0 && valueCol && aggFunc) {
      try {
        // drop any extra columns first
        const keep = [...groupByCols, valueCol];
        const filtered = df.loc({ columns: keep });
        const grouped = filtered.groupby(groupByCols)[aggFunc]([valueCol]);
        setOutput(prev => ({ ...prev, value: grouped }));
      } catch (e) {
        console.warn("Aggregation failed", e);
        setOutput(prev => ({ ...prev, value: null }));
      }
    } else {
      setOutput(prev => ({ ...prev, value: null }));
    }
  }, [inputs, groupByCols, valueCol, aggFunc]);

  useEffect(() => {
    setGroupByCols([])
    setValueCol('')
  }, [inputs])

  useEffect(() => {
    Object.values(dependencies).forEach(f => f(output.value));
  }, [output.value]);

  const allColumns = inputs[0]?.value?.$columns ?? [];

  useEffect(() => {
    if (groupByCols.length === 0 && allColumns.length > 0) {
      setGroupByCols([allColumns[0]]);
    }
    if (!valueCol && allColumns.length > 1) {
      setValueCol(allColumns[1]);
    }
  }, [allColumns]);

  const toggleGroupByCol = (col: string) => {
    setGroupByCols(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

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
          style={width ? { width: `${width}px` } : { width: "240px" }}
        >
          <CardHeader className="bg-[#3b3f42] text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
            {label}
          </CardHeader>
          <CardContent className="pt-3 pb-4 px-0 bg-[#696f72]">
            <div className="flex flex-col gap-4 px-4">

              {/* Input Port */}
              {inputs.map((input, idx) => {
                const updateFn = () => (v: any) => updateInput(idx, { value: v });
                return (
                  <div key={input.id} className="self-start flex items-center !mr-0 pr-0">
                    <div
                      className="!ml-0 !px-0 flex items-center"
                      ref={el => { portRefs.current[input.id] = el; }}
                    >
                      <button
                        className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full ${input.connected ? "!bg-gray-400" : "!bg-gray-600"
                          } !p-0 !border-0 !cursor-pointer`}
                        onMouseUp={() => {
                          setSelectedInputId(input.id);
                          setUpdateInputFunction(updateFn);
                          finishConnection(input.id);
                          updateInput(idx, { connected: selectedOutputId });
                          if (addDependencyFunction && removeDependencyFunction) {
                            updateInput(idx, { addDependencyFunction, removeDependencyFunction });
                          }
                        }}
                        onMouseDown={() => {
                          setSelectedOutputId(input.connected);
                          setSelectedInputId(input.id);
                          if (input.removeDependencyFunction && input.addDependencyFunction) {
                            input.removeDependencyFunction(input.id);
                            input.connected && setRemoveDependencyFunction(() => input.removeDependencyFunction!);
                            input.connected && setAddDependencyFunction(() => input.addDependencyFunction!);
                            input.connected && moveEndPoint(input.id);
                            updateInput(idx, { connected: null });
                          }
                        }}
                      ></button>
                    </div>
                  </div>
                );
              })}

              {/* Group-by multi-select */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white text-black">
                    Group by Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-[10000]" onCloseAutoFocus={e => e.preventDefault()}>
                  <DropdownMenuLabel>Select group-by columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allColumns.map(col => (
                    <DropdownMenuCheckboxItem
                      key={col}
                      checked={groupByCols.includes(col)}
                      onSelect={e => e.preventDefault()}
                      onCheckedChange={() => toggleGroupByCol(col)}
                    >
                      {col}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Display selected group-by columns */}
              {groupByCols.length > 0 && (
                <div className="flex flex-wrap gap-2 text-[10px] text-white">
                  {groupByCols.map(col => (
                    <span
                      key={col}
                      className="bg-[#3b3f42] px-2 py-1 rounded text-xs font-mono"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              )}

              {/* Value column select */}
              <Select value={valueCol} onValueChange={setValueCol}>
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Aggregate column" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Aggregation function select */}
              <Select value={aggFunc} onValueChange={setAggFunc}>
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Function" />
                </SelectTrigger>
                <SelectContent>
                  {AGG_FUNCS.map(fn => (
                    <SelectItem key={fn} value={fn}>{fn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Output Port */}
              <div className="self-end text-right flex !ml-0 pl-0">
                <div className="text-white text-sm font-mono mr-2">DF</div>
                <div
                  className="!mr-0 !px-2 flex items-center"
                  ref={el => { portRefs.current[output.id] = el; }}
                >
                  <button
                    className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full ${output.value ? "!bg-gray-600" : "!bg-gray-900"
                      } !p-0 !border-0 cursor-pointer`}
                    onMouseDown={() => {
                      startConnection(output.id);
                      setSelectedOutputId(output.id);
                      setAddDependencyFunction(() => addDependency);
                      setRemoveDependencyFunction(() => removeDependency);
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

export default React.memo(NodeGroupByAggregate);
