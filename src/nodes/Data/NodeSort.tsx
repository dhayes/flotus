// NodeSort.tsx
import React, { useEffect, useMemo } from "react";
import * as dfd from "danfojs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, X, CircleFadingArrowUpIcon, CircleArrowDownIcon, CircleArrowUpIcon } from "lucide-react";
import { createNodeComponent } from "../createNodeComponent";
import { safeCopy } from "@/lib/utils";

interface SortRule {
    column: string;
    ascending: boolean;
}

interface State {
    rules: SortRule[];
}

const NodeSort = createNodeComponent<State>({
    label: "Sort DataFrame",
    description:
        "Sort a DataFrame by one or more columns in order of priority. Each column can be ascending or descending.",
    width: 340,
    initialInputs: ["dataframe"],
    outputType: "dataframe",
    initialState: {
        rules: [{ column: null, ascending: true }],
    },

    computeOutput: (inputs, state) => {
        const df = inputs[0]?.value as dfd.DataFrame | null;
        if (!df) return null;

        const validRules = state.rules.filter((r) => r.column).reverse();
        if (validRules.length === 0) return df.copy();

        let sortedDf = safeCopy(df);
        if (!sortedDf) return null;

        for (const r of validRules) {
            if (!df.columns.includes(r.column)) {
                console.warn(`Sort column "${r.column}" does not exist in DataFrame.`);
                return df.copy();
            }
            sortedDf = sortedDf.sortValues(r.column, { ascending: r.ascending });
            if (!sortedDf) {
                console.warn(`Sorting by column "${r.column}" failed.`);
                return df.copy();
            }
        }
        return safeCopy(sortedDf);
    },

    renderInputControls: () => null,

    renderControls: ({ inputs, state, setState }) => {
        const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
        const columns = useMemo(() => (df ? df.columns : []), [df]);

        useEffect(() => {
            // Ensure at least one rule exists
            if (state.rules.length === 0) {
                setState((s) => ({ ...s, rules: [{ column: null, ascending: true }] }));
            }
        }, [state.rules.length]);

        const updateRule = (i: number, field: keyof SortRule, value: any) =>
            setState((s) => ({
                ...s,
                rules: s.rules.map((r, j) =>
                    i === j ? { ...r, [field]: value } : r
                ),
            }));

        const addRule = () =>
            setState((s) => ({
                ...s,
                rules: [...s.rules, { column: null, ascending: true }],
            }));

        const removeRule = (i: number) =>
            setState((s) => ({
                ...s,
                rules: s.rules.filter((_, j) => j !== i),
            }));

        const toggleAsc = (i: number) =>
            setState((s) => ({
                ...s,
                rules: s.rules.map((r, j) =>
                    i === j ? { ...r, ascending: !r.ascending } : r
                ),
            }));

        return (
            <div className="flex flex-col gap-3 p-2">
                <div className="text-sm text-gray-300 mb-1">Sort columns by:</div>

                {state.rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Select
                            value={rule.column ?? ""}
                            onValueChange={(v) => updateRule(i, "column", v)}
                        >
                            <SelectTrigger className="bg-white text-black text-xs w-[180px]">
                                <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Columns</SelectLabel>
                                    {columns.map((col: string) => (
                                        <SelectItem key={col} value={col}>
                                            {col}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                            {rule.ascending ? (
                                <Button onClick={() => toggleAsc(i)} variant="outline" size="icon" aria-label="Submit">
                                    <CircleArrowUpIcon />
                                </Button>
                            ) : (
                                <Button onClick={() => toggleAsc(i)} variant="outline" size="icon" aria-label="Submit">
                                    <CircleArrowDownIcon />
                                </Button>
                            )}

                        {state.rules.length > 1 && (
                            <Button
                                onClick={() => removeRule(i)}
                                variant="outline"
                                size="icon"
                                aria-label="Remove sort rule"
                            >
                                <X />
                            </Button>
                        )}
                    </div>
                ))}

                <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs w-fit"
                    onClick={addRule}
                >
                    + Add Column
                </Button>

                {state.rules.length > 1 && (
                    <div className="text-xs text-gray-400 mt-1">
                        Sorting is applied top-to-bottom (first rule has highest priority).
                    </div>
                )}
            </div>
        );
    },

    hideOutputPort: false,
});

export default NodeSort;
