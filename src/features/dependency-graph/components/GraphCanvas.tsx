import '@xyflow/react/dist/style.css';
import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { Edge, Node } from '@xyflow/react';
import type { MouseEvent } from 'react';

import { ActivityFlowNode } from './nodes/ActivityFlowNode';
import { ResourceFlowNode } from './nodes/ResourceFlowNode';
import type { AppNode } from '../types/graph';

// Stable module-level constants so React Flow never sees new references between renders.
const nodeTypes = {
  activity: ActivityFlowNode,
  resource: ResourceFlowNode,
};

const defaultEdgeStyle = { stroke: '#94a3b8', strokeWidth: 1.5 };
const defaultMarkerEnd = { type: MarkerType.ArrowClosed, color: '#94a3b8' };

const defaultEdgeOptions = {
  type: 'smoothstep',
  style: defaultEdgeStyle,
  markerEnd: defaultMarkerEnd,
};

const fitViewOptions = { padding: 0.2 };

interface Props {
  initialNodes: AppNode[];
  initialEdges: Edge[];
  selectedNodeId: string | null;
  onNodeSelect: (id: string | null) => void;
}

export function GraphCanvas({ initialNodes, initialEdges, selectedNodeId, onNodeSelect }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Recompute highlight/dim state whenever the selected node changes.
  useEffect(() => {
    if (!selectedNodeId) {
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false, className: '' })));
      setEdges((eds) =>
        eds.map((e) => ({ ...e, style: defaultEdgeStyle, markerEnd: defaultMarkerEnd })),
      );
      return;
    }

    const connectedEdgeIds = new Set<string>();
    const highlightedNodeIds = new Set<string>([selectedNodeId]);

    for (const e of initialEdges) {
      if (e.source === selectedNodeId || e.target === selectedNodeId) {
        connectedEdgeIds.add(e.id);
        highlightedNodeIds.add(e.source);
        highlightedNodeIds.add(e.target);
      }
    }

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: n.id === selectedNodeId,
        className: highlightedNodeIds.has(n.id) ? '' : 'opacity-30',
      })),
    );

    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: connectedEdgeIds.has(e.id)
          ? { stroke: '#475569', strokeWidth: 2 }
          : { stroke: '#cbd5e1', strokeWidth: 1, opacity: 0.25 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: connectedEdgeIds.has(e.id) ? '#475569' : '#cbd5e1',
        },
      })),
    );
  }, [selectedNodeId, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      // Clicking the already-selected node toggles it off.
      onNodeSelect(node.id === selectedNodeId ? null : node.id);
    },
    [selectedNodeId, onNodeSelect],
  );

  const handlePaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        fitView
        fitViewOptions={fitViewOptions}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} color="#e2e8f0" />
        <Controls />
        <MiniMap
          nodeColor={(n) => (n.type === 'activity' ? '#bfdbfe' : '#e2e8f0')}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
