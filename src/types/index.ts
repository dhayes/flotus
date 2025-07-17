import { pastelHexColors } from "@/lib/utils";

export type Point = { x: number; y: number; };

// export type Lit = string | number | boolean | undefined | null | void | {};
// export const tuple = <T extends Lit[]>(...args: T) => args;

// const portTypes = ["number", "string", "dataframe"];
// type PortTypesTuple = typeof portTypes; // readonly ['hearts', 'diamonds', 'spades', 'clubs']

// export type PortType = PortTypesTuple[number];  // "hearts" | "diamonds" | "spades" | "clubs"

// export const portColors = Object.assign.apply({}, portTypes.map( (v, i) => ( {[v]: pastelHexColors[i]} ) ) )

export const portColors = {
  number: "!bg-[#f3bdbd]",
  string: "!bg-[#f3cebd]",
  dataframe: "!bg-[#f3debd]",
//   "#f3eebd",
//   "#e8f3bd",
//   "#d8f3bd",
//   "#c8f3bd",
//   "#bdf3c3",
//   "#bdf3d3",
//   "#bdf3e3",
//   "#bdf3f3",
//   "#bde3f3",
//   "#bdd3f3",
//   "#bdc3f3",
//   "#c8bdf3",
//   "#d8bdf3",
//   "#e8bdf3",
//   "#f3bdee",
//   "#f3bdde",
//   "#f3bdce"
}