"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export type Option = { label: string; value: string };

interface MultiSelectProps {
  placeholder?: string;
  options: Option[];
  values: string[];
  onChange: (newValues: string[]) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * ShadCN-based multiselect dropdown supporting multiple selection,
 * consistent with node controls API (values + onChange).
 */
const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder = "Select...",
  options,
  values,
  onChange,
  disabled = false,
  className = "",
}) => {
  const handleSelectChange = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const isOptionSelected = (value: string) => values.includes(value);

  const selectedLabels = options
    .filter((opt) => values.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          className={`w-full flex items-center justify-between text-sm ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
        >
          <div className="truncate text-left w-full">
            {selectedLabels || placeholder}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 max-h-60 overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            onSelect={(e) => e.preventDefault()} // prevents unwanted close
            checked={isOptionSelected(opt.value)}
            onCheckedChange={() => handleSelectChange(opt.value)}
          >
            {opt.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelect;
