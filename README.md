# Flotix

Flotix is a node-based visual programming system built with React, TypeScript, Vite, TailwindCSS, and shadcn/ui. It provides a modular, dataflow‑driven workflow engine designed for data analytics, interactive computation, and rapid prototyping of analytical pipelines.

## Overview

Flotix allows users to construct workflows by dragging nodes onto a canvas, connecting ports, and passing data reactively through a graph. Each node encapsulates a transformation step. State is centrally managed through an extensible `NodeEngineContext` and a standardized node factory (`createNodeComponent`).

### Core Features

* **Node Engine** with typed inputs/outputs
* **Reactive graph updates** with dependency propagation
* **Draggable and selectable nodes** with a polished UI
* **Danfo.js integration** for DataFrame operations
* **Charting nodes** (density plots, 3D surfaces, grouped bar charts, correlation matrices)
* **CSV import, column selectors, describe/statistics nodes**
* **Database connection node** with reactive views
* **Save/restore graph** with full serialization
* **Embeddable in cloud environment (Flotix Cloud)**
* **Experimental: dashboards, multi‑tenant support**

### System Architecture

* **Frontend**: React + TypeScript + Vite
* **UI**: Tailwind + shadcn/ui components
* **Data Engine**: Danfo.js DataFrames
* **Node Creation** via `createNodeComponent(config)`
* **Global Graph State**: `NodeEngineContext`
* **Backend (optional)**: Rust Actix‑Web microservices, Postgres, S3-compatible storage

## Node System

A Flotix node is defined by:

* A label and description
* Dimensions and layout metadata
* Input port types (multiple inputs supported)
* A single output type
* Custom rendering logic (React)

Example:

```ts
export const AddNode = createNodeComponent({
  label: "Add",
  description: "Adds two numbers",
  width: 160,
  height: 120,
  initialState: {},
  inputTypes: ["number", "number"],
  outputType: "number",
  render: ({ state, inputs }) => {
    return <div>{inputs[0] + inputs[1]}</div>;
  },
});
```

## Roadmap

### Production UI polish

* Snap-to-grid and alignment guides
* Context menu + right‑click actions
* Keyboard shortcuts for workflow power‑users
* Graph minimap
* Multi‑select + group operations
* Undo/redo stack

### Workflow usability

* Versioned graph storage
* Templates and reusable node groups
* Node search + quick‑add palette

### Advanced nodes

* SQL query builder node
* AI-assisted node (LLM-powered transforms)
* Schema-aware validation for DataFrames

### Cloud platform

* User accounts and secure persistence
* Project sharing and team collaboration
* Execution sandboxing and quotas
* Infrastructure for enterprise deployments

## Development

### Install

```bash
git clone https://github.com/dhayes/flotix.git
cd flotix
yarn install
```

### Run

```bash
yarn dev
```

### Build

```bash
yarn build
```

## Contributing

Contributions are welcome. Guidelines and architectural notes will be added.

## License

MIT
