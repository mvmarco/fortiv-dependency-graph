# Frontend Take-Home Assignment

**Role:** Senior Frontend Engineer
**Time:** 1–2 hours
**Deadline:** Please return within 2-3 days of receiving this

---

## Background

Fortiv is a business continuity management platform. One of its core features is a **dependency graph** — a visual map of which critical business activities rely on which resources (systems, people, buildings, vendors). When something fails, the graph helps organizations quickly understand the blast radius.

Your task is to build a simplified version of this interface.

---

## The Task

Build a **dependency graph viewer** using the provided dataset (`data/graph.json`) with Claude Code.

### Required features

**Graph rendering**

- Render activities and resources as nodes using consistent visualization, with directed edges showing dependencies
- Activities and resources should be visually distinct (different shape, color, or label style — your call)

**Interaction**

- Clicking a node highlights its immediate connections (the node itself, its edges, and the nodes at the other end of those edges)
- Everything else should be visually de-emphasized when a selection is active
- Clicking the background or the selected node again clears the selection

**Single Point of Failure detection**

- Any resource node that is depended on by more than one node should be flagged as a Single Point of Failure (SPOF)
- SPOF nodes must be visually distinct at a glance — not just a tooltip

**Info panel**

- When a node is selected, show a panel (sidebar or overlay) with the node's details from the dataset
- For resource nodes, include a SPOF indicator if applicable

**Interactivity**

- There should be a button the user can click to reload the data and show an updated graph
- There should be an option where activities can be ordered based on their criticality or not
- There should be an option where resources can be ordered based on their criticality or not

### Technical requirements

- Build with Claude Code
- React 19 + TypeScript (strict mode — no `any`, props fully typed)
- React Flow for the graph
- Tailwind CSS for styling
- No backend — load from the provided JSON file

---

## What we are not looking for

- Pixel-perfect design — functional and clear is enough
- Automatic layout perfection — a reasonable initial layout is fine

---

## Setup

You are required to use Claude Code to do this assignment. Below are environment setup details to have Claude Code connect to to our environment. Usage is logged & monitored. You can use either Sonnet or Opus models below:

```
export ANTHROPIC_MODEL='global.anthropic.claude-sonnet-4-6'

or

export ANTHROPIC_MODEL='global.anthropic.claude-opus-4-6-v1'

export AWS_REGION="eu-central-1"
export CLAUDE_CODE_USE_BEDROCK=1
export ANTHROPIC_SMALL_FAST_MODEL='eu.anthropic.claude-haiku-4-5-20251001-v1:0'
export AWS_BEARER_TOKEN_NAME="<provided-in-assignment>"
export AWS_BEARER_TOKEN_BEDROCK="<provided-in-assignment>"
```

Bootstrap however you prefer. A standard Vite + React + TypeScript scaffold works well:

```bash
pnpm create vite my-app --template react-ts
cd my-app
pnpm install
pnpm add @xyflow/react tailwindcss
```

Place the provided `data/graph.json` wherever makes sense in your project.

---

## Submission

Send us:

- Export of the complete conversation with the coding agent - include any questions, follow-ups - the entire conversation you had with the agent and specify which model was used (use `/export` with Claude Code).
- The coding agent should be used to write and update `SOLUTION.md` as an implementation log to track your progress through the implementation with the agent.
- A link to a Git repository (GitHub, GitLab, etc.) with your code (or attached zip)

---

## Data format

See `data/graph.json`. The structure:

```ts
type NodeType = "activity" | "resource";
type ResourceType =
  | "technology"
  | "people"
  | "building"
  | "third_party"
  | "equipment";

interface ActivityNode {
  id: string;
  type: "activity";
  name: string;
  rto_hours: number; // Recovery Time Objective in hours
  priority: "critical" | "high" | "medium" | "low";
  owner: string;
}

interface ResourceNode {
  id: string;
  type: "resource";
  resource_type: ResourceType;
  name: string;
  vendor?: string; // present for third_party resources
  contact?: string; // responsible owner or contact
}

interface Dependency {
  from: string; // activity id
  to: string; // resource id
}

interface GraphData {
  nodes: (ActivityNode | ResourceNode)[];
  dependencies: Dependency[];
}
```
