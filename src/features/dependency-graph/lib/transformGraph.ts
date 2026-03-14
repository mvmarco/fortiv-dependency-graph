import type { Edge } from '@xyflow/react';
import type {
  RawGraph,
  RawActivityNode,
  RawResourceNode,
  AppNode,
  ActivityNodeData,
  ResourceNodeData,
} from '../types/graph';

// ── Layout constants ──────────────────────────────────────────────────────────

const LAYOUT = {
  ACTIVITY_X: 100,
  RESOURCE_X: 560,
  START_Y: 60,
  ACTIVITY_STEP_Y: 110,
  RESOURCE_STEP_Y: 90,
} as const;

/**
 * A resource is flagged as a Single Point of Failure (SPOF) when 2 or more
 * nodes depend on it. If that resource becomes unavailable, multiple activities
 * are impacted simultaneously.
 */
const SPOF_THRESHOLD = 2;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildInboundCounts(raw: RawGraph): Map<string, number> {
  const counts = new Map<string, number>();
  for (const dep of raw.dependencies) {
    counts.set(dep.to, (counts.get(dep.to) ?? 0) + 1);
  }
  return counts;
}

// ── Transform ─────────────────────────────────────────────────────────────────

export function transformGraph(raw: RawGraph): { nodes: AppNode[]; edges: Edge[] } {
  const inboundCounts = buildInboundCounts(raw);

  const activities = raw.nodes.filter((n): n is RawActivityNode => n.type === 'activity');
  const resources = raw.nodes.filter((n): n is RawResourceNode => n.type === 'resource');

  const activityNodes: AppNode[] = activities.map((n, i) => ({
    id: n.id,
    type: 'activity' as const,
    position: {
      x: LAYOUT.ACTIVITY_X,
      y: LAYOUT.START_Y + i * LAYOUT.ACTIVITY_STEP_Y,
    },
    data: {
      kind: 'activity',
      name: n.name,
      rto_hours: n.rto_hours,
      priority: n.priority,
      owner: n.owner,
    } satisfies ActivityNodeData,
  }));

  const resourceNodes: AppNode[] = resources.map((n, i) => ({
    id: n.id,
    type: 'resource' as const,
    position: {
      x: LAYOUT.RESOURCE_X,
      y: LAYOUT.START_Y + i * LAYOUT.RESOURCE_STEP_Y,
    },
    data: {
      kind: 'resource',
      resource_type: n.resource_type,
      name: n.name,
      vendor: n.vendor,
      contact: n.contact,
      isSPOF: (inboundCounts.get(n.id) ?? 0) >= SPOF_THRESHOLD,
      dependencyCount: inboundCounts.get(n.id) ?? 0,
    } satisfies ResourceNodeData,
  }));

  const edges: Edge[] = raw.dependencies.map((dep, i) => ({
    id: `e${i}-${dep.from}-${dep.to}`,
    source: dep.from,
    target: dep.to,
  }));

  return { nodes: [...activityNodes, ...resourceNodes], edges };
}
