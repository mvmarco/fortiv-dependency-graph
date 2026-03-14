import type { Node } from '@xyflow/react';

// ── Raw JSON shapes ───────────────────────────────────────────────────────────

export type Priority = 'critical' | 'high' | 'medium';

export type ResourceType =
  | 'technology'
  | 'third_party'
  | 'people'
  | 'building'
  | 'equipment';

export interface RawActivityNode {
  id: string;
  type: 'activity';
  name: string;
  rto_hours: number;
  priority: Priority;
  owner: string;
}

export interface RawResourceNode {
  id: string;
  type: 'resource';
  resource_type: ResourceType;
  name: string;
  vendor?: string;
  contact: string;
}

export type RawNode = RawActivityNode | RawResourceNode;

export interface RawDependency {
  from: string;
  to: string;
}

export interface RawGraph {
  nodes: RawNode[];
  dependencies: RawDependency[];
}

// ── React Flow node data ──────────────────────────────────────────────────────
// Both interfaces extend Record<string, unknown> as required by @xyflow/react.

export interface ActivityNodeData extends Record<string, unknown> {
  kind: 'activity';
  name: string;
  rto_hours: number;
  priority: Priority;
  owner: string;
}

export interface ResourceNodeData extends Record<string, unknown> {
  kind: 'resource';
  resource_type: ResourceType;
  name: string;
  vendor?: string;
  contact: string;
  /** True when 2+ nodes depend on this resource (single point of failure). */
  isSPOF: boolean;
  dependencyCount: number;
}

// ── React Flow node types ─────────────────────────────────────────────────────

export type ActivityFlowNode = Node<ActivityNodeData, 'activity'>;
export type ResourceFlowNode = Node<ResourceNodeData, 'resource'>;
export type AppNode = ActivityFlowNode | ResourceFlowNode;
