import React, { useEffect, useMemo } from "react";
import * as dfd from "danfojs";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import { createNodeComponent } from "../createNodeComponent";
import { GripVertical } from "lucide-react";

// Type for React DnD
interface DragItem {
  index: number;
  id: string;
  type: "COLUMN";
}

interface State {
  order: string[];
}

/* -------------------------------------------------------------------------- */
/*  Draggable Row component                                                   */
/* -------------------------------------------------------------------------- */
const DraggableColumn = ({
  col,
  index,
  moveItem,
}: {
  col: string;
  index: number;
  moveItem: (from: number, to: number) => void;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: "COLUMN",
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { id: col, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between px-2 py-1 mb-1 rounded text-sm bg-white text-black cursor-grab transition
        ${isDragging ? "opacity-40" : ""}
      `}
    >
      <span className="text-xs truncate">{col}</span>
      <GripVertical className="w-3 h-3 opacity-60" />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Main Node Component                                                      */
/* -------------------------------------------------------------------------- */
const NodeReorderColumns = createNodeComponent<State>({
  label: "Reorder Columns",
  description:
    "Reorder DataFrame columns by drag-and-drop. Works inside draggable nodes using React DnD.",
  width: 340,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: { order: [] },

  computeOutput: (inputs, state) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;
    if (!df) return null;
    const valid = state.order.filter((c) => df.columns.includes(c));
    if (!valid.length) return df.copy();
    return df.loc({ columns: valid });
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;
    const columns = useMemo(() => (df ? df.columns : []), [df]);

    useEffect(() => {
      if (df && state.order.length === 0) {
        setState((s) => ({ ...s, order: [...df.columns] }));
      }
    }, [df]);

    const moveItem = (from: number, to: number) => {
      setState((s) => {
        const arr = [...s.order];
        const [moved] = arr.splice(from, 1);
        arr.splice(to, 0, moved);
        return { ...s, order: arr };
      });
    };

    const resetOrder = () => {
      if (df) setState((s) => ({ ...s, order: [...df.columns] }));
    };

    return (
      <div className="flex flex-col gap-2 p-2">
        <div className="text-sm text-gray-300 mb-1">Reorder columns:</div>

        <div className="nodrag rounded p-2 max-h-48 overflow-y-auto select-none">
          {state.order.map((col, i) => (
            <DraggableColumn key={col} col={col} index={i} moveItem={moveItem} />
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="mt-2 w-fit text-xs"
          onClick={resetOrder}
        >
          Reset order
        </Button>
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodeReorderColumns;
