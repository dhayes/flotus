// createNodeComponent.tsx

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useId,
  JSX,
} from "react";
import Draggable from "react-draggable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConnectionContext } from "@/Connections";
import { StageContext } from "@/Stage";
import type { Point } from "@/types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@/components/ui/tooltip";

interface InputPortConfig {
  id: string;
  value: any;
  connected: string | null;
  removeDependencyFunction?: (id: string) => void;
  addDependencyFunction?: (id: string, f: (value: any) => void) => void;
}

interface OutputPort {
  id: string;
  value: any;
  connected: string | null;
}

interface NodeFactoryProps<State> {
  label: string;
  description: string;
  width?: number;
  initialState: State;
  initialInputs: number;
  computeOutput: (inputs: InputPortConfig[], state: State) => any;
  renderControls: (props: {
    state: State;
    setState: React.Dispatch<React.SetStateAction<State>>;
    inputs: InputPortConfig[];
    updateInput: (index: number, changes: Partial<InputPortConfig>) => void;
  }) => JSX.Element;
  hideOutputPort?: boolean;
  renderInputControls?: (props: {
    input: InputPortConfig;
    index: number;
    updateInput: (index: number, changes: Partial<InputPortConfig>) => void;
  }) => JSX.Element;
  renderOutput?: (output: any) => JSX.Element;
}

export function createNodeComponent<State>(config: NodeFactoryProps<State>): React.FC<any> {
  return function NodeComponent({
    id,
    label = config.label,
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
    openContextMenu,
    removeNode,
    style,
  }) {
    const { startConnection, finishConnection, updatePortPosition, moveEndPoint, deleteConnectons } =
      useContext(ConnectionContext);
    const { offsetX, offsetY, scale } = useContext(StageContext);

    const nodeRef = useRef<HTMLDivElement>(null);
    const portRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const makeInput = (): InputPortConfig => ({
      id: useId(),
      value: null,
      connected: null,
    });

    const [inputs, setInputs] = useState<InputPortConfig[]>(
      Array.from({ length: config.initialInputs }, makeInput)
    );

    const outputId = useId();
    const [output, setOutput] = useState<OutputPort>({ id: outputId, value: null, connected: null });
    const [dependencies, setDependencies] = useState<Record<string, (v: any) => void>>({});
    const [state, setState] = useState<State>(config.initialState);

    const updateInput = (index: number, changes: Partial<InputPortConfig>) => {
      setInputs((prev) => prev.map((inp, i) => (i === index ? { ...inp, ...changes } : inp)));
    };

    const addDependency = (id: string, f: (v: any) => void) => {
      f(output.value);
      setDependencies((prev) => ({ ...prev, [id]: f }));
    };

    const removeDependency = (id: string) => {
      setDependencies((prev) => {
        const cp = { ...prev };
        delete cp[id];
        return cp;
      });
    };

    useEffect(() => {
      Object.values(dependencies).forEach((f) => f(output.value));
    }, [output.value]);

    useEffect(() => {
      const newValue = config.computeOutput(inputs, state);
      setOutput((prev) => ({ ...prev, value: newValue }));
    }, [inputs, state]);

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
      document.addEventListener("mouseup", handleMouseUp);
      return () => document.removeEventListener("mouseup", handleMouseUp);
    }, []);

    return (
      <Draggable
        defaultClassName="inline-block draggable-item absolute node"
        nodeRef={nodeRef}
        onDrag={updatePortPositions}
        onStop={updatePortPositions}
        cancel="button,input,select,.plotly"
      >
        <div ref={nodeRef} style={style} onContextMenu={(e: any) => {
          e.preventDefault();
          console.log(e)
          openContextMenu(
            {
              x: e.clientX,
              y: e.clientY,
            },
            [
              {
                label: "Delete Node",
                category: "Node",
                icon: "trash-2",
                onClick: () => {
                  removeNode(id);
                  deleteConnectons(Object.entries(portRefs.current).map(([id]) => id))
                }
              }
            ]
          );
        }}
        >
          <Card
            className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-0 !shadow-none !border-none"
            style={width ? { width: `${width}px` } : { width: config.width || 240 }}
          >
            <CardHeader className="text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
              <div className="flex justify-between items-center">
                <span>{label}</span>
                <Tooltip>
                  <TooltipTrigger asChild className="rounded-full">
                    <button className="hover:text-gray-300 !rounded-full !p-0 my-0 border-0 !bg-[#53585a]">
                      <Info className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-black text-white p-2 mr-1 text-xs rounded">
                    {config.description}
                    <TooltipArrow className="pb-1" style={{ height: 15, width: 14 }} />
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="pt-3 pb-4 px-0 bg-[#696f72]">
              <div className="flex flex-col gap-4 px-4">
                {inputs.map((input, index) => {
                  const updateFn = () => (v: any) => updateInput(index, { value: v });
                  return (
                    <div key={input.id} className="self-start flex items-center">
                      <div
                        className="!ml-0 !px-0 flex items-center"
                        ref={(el) => {
                          portRefs.current[input.id] = el;
                        }}
                      >
                        <button
                          className={`!mx-0 !px-1 !w-4 !aspect-square !rounded-full ${input.connected ? "!bg-gray-400" : "!bg-gray-600"
                            } !p-0 !border-0 !cursor-pointer`}
                          onMouseUp={() => {
                            setSelectedInputId(input.id);
                            setUpdateInputFunction(updateFn);
                            finishConnection(input.id);
                            updateInput(index, { connected: selectedOutputId });
                            if (addDependencyFunction && removeDependencyFunction) {
                              updateInput(index, { addDependencyFunction, removeDependencyFunction });
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
                      {config.renderInputControls &&
                        config.renderInputControls({
                          input,
                          index,
                          updateInput,
                        })}
                    </div>
                  );
                })}

                <div>
                  {config.renderControls({ state, setState, inputs, updateInput })}
                </div>

                <div className="self-end text-right flex">
                  {config.renderOutput ? config.renderOutput(output.value) : null}
                  {
                    (!config.hideOutputPort) && (
                      <div
                        className="!mr-0 !px-0 flex items-center"
                        ref={(el) => {
                          portRefs.current[output.id] = el;
                        }}
                      >
                        <button
                          className={`!ml-1 !px-2 !w-4 !aspect-square !rounded-full ${output.value ? "!bg-gray-600" : "!bg-gray-900"
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
                    )
                  }
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </Draggable >
    );
  };
}
