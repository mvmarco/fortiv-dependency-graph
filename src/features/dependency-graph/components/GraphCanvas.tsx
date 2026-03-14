import '@xyflow/react/dist/style.css';
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

import { useGraphData } from '../hooks/useGraphData';
import { ActivityFlowNode } from './nodes/ActivityFlowNode';
import { ResourceFlowNode } from './nodes/ResourceFlowNode';

// Defined outside the component so the reference is stable across renders,
// preventing React Flow from re-registering node types unnecessarily.
const nodeTypes = {
  activity: ActivityFlowNode,
  resource: ResourceFlowNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
  style: { stroke: '#94a3b8', strokeWidth: 1.5 },
};

const fitViewOptions = { padding: 0.2 };

export function GraphCanvas() {
  const { nodes: initialNodes, edges: initialEdges } = useGraphData();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
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
