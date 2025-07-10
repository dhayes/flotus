import React, { useContext, useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Draggable from "react-draggable";
import * as dfd from "danfojs";
import { ConnectionContext } from "@/Connections";
import { StageContext } from "@/Stage";
import type { Point } from "@/types";

type InputPort = {
  id: string;
  value: any;
  connected: string | null;
  removeDependencyFunction?: (id: string) => void;
  addDependencyFunction?: (id: string, f: (value: any) => void) => void;
};

const OPERATORS = ["==", "!=", "<", ">", "<=", ">="];

const NodeFilterRows: React.FC<any> = ({
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

  const [inputs, setInputs] = useState<InputPort[]>([
    { id: inputId, value: null, connected: null },
  ]);
  const [output, setOutput] = useState<{ id: string; value: dfd.DataFrame | null; connected: string | null }>({
    id: outputId,
    value: null,
    connected: null,
  });

  const [dependencies, setDependencies] = useState<Record<string, (v: any) => void>>({});
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [operator, setOperator] = useState<string>("==");
  const [filterValue, setFilterValue] = useState<string>("");

  const updateInput = (index: number, changes: Partial<InputPort>) => {
    setInputs((prev) => prev.map((inp, i) => (i === index ? { ...inp, ...changes } : inp)));
  };

  const updatePortPositions = () => {
    Object.entries(portRefs.current).forEach(([id, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const center: Point = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        updatePortPosition(id, center);
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
    updatePortPositions();
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const addDependency = (id: string, f: (v: any) => void) => {
    f(output.value);
    setDependencies((prev) => ({ ...prev, [id]: f }));
  };

  const removeDependency = (id: string) => {
    setDependencies((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  useEffect(() => {
    console.log(inputs)
    const df = inputs[0].value;
    console.log(df)
    if (df && df.shape[0] > 0 && selectedColumn && operator && filterValue !== "") {
      try {
        console.log("AAA")
        const col = df?.column(selectedColumn);
        const dtype = col?.dtype;
        const typedVal = dtype === "int32" || dtype === "float32" ? parseFloat(filterValue) : filterValue;

        const boolMask = col.values.map((val: any) => {
          switch (operator) {
            case "==": return val == typedVal;
            case "!=": return val != typedVal;
            case "<": return val < typedVal;
            case ">": return val > typedVal;
            case "<=": return val <= typedVal;
            case ">=": return val >= typedVal;
            default: return true;
          }
        });
        const filtered = df.loc({ rows: boolMask });
        setOutput((prev) => ({ ...prev, value: filtered }));
      } catch (e) {
        console.warn("Filtering failed", e);
        setOutput((prev) => ({ ...prev, value: df }));
      }
    } else {
      setOutput((prev) => ({ ...prev, value: df }));
    }
  }, [inputs, selectedColumn, operator, filterValue]);

  useEffect(() => {
    Object.values(dependencies).forEach((f) => f(output.value));
  }, [output.value]);

  const allColumns = inputs[0]?.value?.$columns ?? [];

  useEffect(() => {
    if (!selectedColumn && allColumns.length > 0) {
      setSelectedColumn(allColumns[0]);
    }
  }, [allColumns]);

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
              {inputs.map((input, index) => {
                const updateInputFunction = () => (value: any) => {
                  updateInput(index, { value });
                };
                return (
                  <div key={input.id} className="self-start text-left flex !mr-0 pr-0">
                    <div
                      className="!ml-0 !px-0 flex items-center"
                      ref={(el) => {
                        portRefs.current[input.id] = el;
                      }}
                    >
                      <button
                        className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full ${
                          input.connected ? "!bg-gray-400" : "!bg-gray-600"
                        } !p-0 !border-0 !cursor-pointer`}
                        aria-label="Input port"
                        onMouseUp={() => {
                          setSelectedInputId(input.id);
                          setUpdateInputFunction(updateInputFunction);
                          finishConnection(input.id);
                          updateInput(index, { connected: selectedOutputId });
                          if (addDependencyFunction && removeDependencyFunction) {
                            updateInput(index, {
                              addDependencyFunction,
                              removeDependencyFunction,
                            });
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

              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Column" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Value"
                className="bg-white text-black"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />

              <div className="self-end text-right flex !ml-0 pl-0">
                <div className="text-white text-sm font-mono mr-2">DF</div>
                <div
                  className="!mr-0 !px-2 flex items-center"
                  ref={(el) => {
                    portRefs.current[output.id] = el;
                  }}
                >
                  <button
                    className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full ${
                      output.value ? "!bg-gray-600" : "!bg-gray-900"
                    } !p-0 !border-0 cursor-pointer`}
                    aria-label="Output port"
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

export default React.memo(NodeFilterRows);
