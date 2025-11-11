// NodeUploadCSV.tsx

import React, { useRef, useState, useEffect } from "react";
import * as dfd from "danfojs";
import { Input } from "@/components/ui/input";
import { createNodeComponent } from "../createNodeComponent";

const NodeUploadCSV = createNodeComponent({
  label: "Upload CSV",
  description: "Loads a CSV file into a DataFrame and outputs it.",
  width: 280,
  initialInputs: [],
  outputType: "dataframe",
  initialState: {
    df: null as dfd.DataFrame | null,
    filename: "",
    isDragging: false,
  },

  computeOutput: (_, state) => {
    const newDF = state.df?.copy();
    return newDF;
  },

  renderControls: ({ state, setState }) => {
    const dropRef = useRef<HTMLDivElement>(null);

    const processDataFrame = (df: dfd.DataFrame): dfd.DataFrame => {
      const missing = ["NA", "N/A", "null", "?", ""];
      const newDf = df.copy();
      missing.forEach((val) => newDf.replace(val, NaN, { inplace: true }));
      return newDf;
    };

    const handleFile = async (file: File) => {
      try {
        setState((prev) => ({ ...prev, filename: file.name }));
        const rawDf = await dfd.readCSV(file);
        const processed = processDataFrame(rawDf);
        setState((prev) => ({ ...prev, df: processed }));
      } catch (err) {
        console.error("Failed to read file", err);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    };

    // Drag & Drop behavior
    useEffect(() => {
      const drop = dropRef.current;
      if (!drop) return;

      const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setState((s) => ({ ...s, isDragging: true }));
      };

      const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setState((s) => ({ ...s, isDragging: false }));
      };

      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer!.dropEffect = "copy";
        setState((s) => ({ ...s, isDragging: true }));
      };

      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setState((s) => ({ ...s, isDragging: false }));
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
      <div className="flex flex-col gap-4" ref={dropRef}>
        <div
          className={`border-dashed border-2 rounded p-4 text-sm text-white text-center transition ${
            state.isDragging ? "border-blue-400 bg-blue-900/20" : "border-gray-400"
          }`}
        >
          {state.isDragging
            ? "Drop your CSV file here"
            : state.filename
            ? `Loaded: ${state.filename}`
            : "Drag & drop a CSV/TSV file or click below"}
        </div>

        <Input type="file" accept=".csv,.tsv" onChange={handleFileChange} />
      </div>
    );
  },
});

export default NodeUploadCSV;
