# SOLUTION.md

## Model Used

Claude Sonnet 4.6 via Claude Code

## Setup

- Initialized repository with the provided assignment files
- Scaffolded project using Vite + React + TypeScript
- Installed React Flow for graph rendering
- Installed Tailwind CSS for styling
- Preserved the provided dataset at `data/graph.json`
- Cleaned the default Vite starter files

## Step 1 — Data layer

### Folder structure

Feature-based layout under `src/features/dependency-graph/`:

```
src/
  app/
    App.tsx
  features/
    dependency-graph/
      components/
        GraphCanvas.tsx       (stub — Step 2)
        DetailPanel.tsx       (stub — Step 2)
        Legend.tsx            (stub — Step 2)
        nodes/
          ActivityFlowNode.tsx  (stub — Step 2)
          ResourceFlowNode.tsx  (stub — Step 2)
      hooks/
        useGraphData.ts       loads + memoises transformed graph data
      lib/
        transformGraph.ts     raw JSON → React Flow nodes + edges
      types/
        graph.ts              all TypeScript domain and React Flow types
  index.css
  main.tsx
```

### TypeScript types (`types/graph.ts`)

- **Raw shapes** — `RawActivityNode`, `RawResourceNode`, `RawNode`, `RawDependency`, `RawGraph` mirror the JSON exactly
- **String literal unions** — `Priority` (`critical | high | medium`) and `ResourceType` (`technology | third_party | people | building | equipment`)
- **React Flow data** — `ActivityNodeData` and `ResourceNodeData` both extend `Record<string, unknown>` as required by `@xyflow/react`
- **Node union** — `AppNode = ActivityFlowNode | ResourceFlowNode` typed with React Flow's `Node<TData, TType>` generic

### Transform (`lib/transformGraph.ts`)

- Type-predicate filtering separates activities from resources before mapping
- Simple 2-column layout: activities at `x=100`, resources at `x=560`, both spaced vertically
- SPOF detection: counts inbound edges per node; a resource is flagged `isSPOF: true` when `dependencyCount >= 2`
- Edges carry a stable deterministic `id` (`e{index}-{from}-{to}`)

### SPOF analysis

With threshold ≥ 2 inbound dependencies, 10 of 15 resources are flagged as SPOFs:

| Resource | Depended on by |
|---|---|
| res-1 Core Banking System | act-1, act-2, act-5 |
| res-3 Data Warehouse | act-3, act-5 |
| res-4 Salesforce CRM | act-2, act-4 |
| res-5 VPN & Network Access | act-4, act-8 |
| res-6 Finance Team | act-1, act-6 |
| res-7 IT Infrastructure Team | act-7, act-8 |
| res-9 HQ Office | act-6, act-8 |
| res-10 Primary Data Centre | act-1, act-3, act-7 |
| res-11 AWS Cloud Infrastructure | act-6, act-7 |
| res-12 Microsoft 365 | act-2, act-4, act-5, act-8 |

### Config change

Added `"resolveJsonModule": true` to `tsconfig.app.json` to enable typed JSON imports from `data/graph.json`.

---

## Step 2 — React Flow canvas

### GraphCanvas (`components/GraphCanvas.tsx`)

- Calls `useGraphData()` to get the transformed nodes and edges from Step 1
- Uses `useNodesState` / `useEdgesState` to allow node dragging without re-deriving from source data
- `nodeTypes` and `defaultEdgeOptions` are module-level constants so React Flow never sees a new reference between renders
- `fitView` + `fitViewOptions` ensure the full graph is visible on first load regardless of screen size
- Built-in React Flow `Controls` (zoom/pan buttons) and `MiniMap` are included
- `Background` uses a dot grid for visual orientation

### Custom node components

**ActivityFlowNode** — coloured left border by priority:
- `critical` → red
- `high` → orange
- `medium` → sky blue

Shows activity name, priority badge, and RTO in hours.

**ResourceFlowNode** — coloured left border by resource type:
- `technology` → blue
- `third_party` → violet
- `people` → emerald
- `building` → amber
- `equipment` → slate

Shows resource name, type badge, and a red `SPOF` badge when `isSPOF: true`.

Both components accept `selected` from `NodeProps` and apply a subtle ring when selected (foundation for the detail panel in Step 3).

### Edge styling

`defaultEdgeOptions` applied at the canvas level:
- `smoothstep` routing for clean curved edges in the 2-column layout
- `ArrowClosed` marker end for clear direction
- Neutral slate colour to keep nodes visually dominant

### App shell (`App.tsx`)

- `h-screen flex flex-col` layout with a fixed header and `flex-1 min-h-0` main area
- `min-h-0` prevents flex children from overflowing when the canvas is taller than the viewport

---

## Step 3 — Node selection and detail panel

### State architecture

`selectedNodeId: string | null` lives in `App.tsx`. This lets `App` look up the selected `AppNode` from the `useGraphData()` result and pass it to `DetailPanel` without calling the hook twice.

`useGraphData()` also moved to `App.tsx`. The resolved `nodes` and `edges` are passed as `initialNodes` / `initialEdges` props to `GraphCanvas`.

### Selection behaviour (`GraphCanvas`)

A `useEffect` keyed on `[selectedNodeId, initialEdges]` recomputes the visual state on every selection change:

- Walks `initialEdges` once to build `connectedEdgeIds` and `highlightedNodeIds` (selected node + its direct neighbors)
- Calls `setNodes` to apply `className: 'opacity-30'` to every node **not** in `highlightedNodeIds`, and `selected: true` on the selected node (drives the ring in the custom components)
- Calls `setEdges` to apply a bold slate style to connected edges and a faded style to unrelated ones
- When `selectedNodeId` is `null`, resets all `className` values and edge styles to defaults

`onNodeClick` toggles selection: clicking the already-selected node calls `onNodeSelect(null)`.
`onPaneClick` always clears selection.

### Detail panel (`DetailPanel.tsx`)

Renders in a `w-72` aside to the right of the canvas, only when `selectedNode` is non-null.

**Activity fields:** priority (coloured badge), owner, recovery time objective
**Resource fields:** resource type, contact, vendor (only if present), SPOF status with dependent node count

The `Row` helper is a local function — no abstraction file needed for a single use.

---

## Observations about dataset

While inspecting the dataset, I noticed that most dependencies follow the expected pattern:

activity -> resource

However the dataset also contains at least one activity-to-activity dependency:

act-8 -> act-6

This means the dependency graph cannot assume that all edges connect activities to resources only. The implementation therefore treats dependencies generically as node-to-node edges so the graph can support:

- activity -> resource
- activity -> activity

This ensures the visualization remains correct even if additional activity-level dependencies are introduced in the dataset.
