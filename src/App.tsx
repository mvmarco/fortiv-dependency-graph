import { useState } from 'react';
import { useGraphData } from './features/dependency-graph/hooks/useGraphData';
import { GraphCanvas } from './features/dependency-graph/components/GraphCanvas';
import { DetailPanel } from './features/dependency-graph/components/DetailPanel';

function App() {
  const { nodes, edges } = useGraphData();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = selectedNodeId
    ? (nodes.find((n) => n.id === selectedNodeId) ?? null)
    : null;

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
        <h1 className="text-base font-semibold text-slate-900">Dependency Graph</h1>
        <p className="text-xs text-slate-500">Business activities and their resource dependencies</p>
      </header>
      <div className="flex min-h-0 flex-1">
        <main className="min-h-0 flex-1">
          <GraphCanvas
            initialNodes={nodes}
            initialEdges={edges}
            selectedNodeId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
          />
        </main>
        {selectedNode && (
          <DetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
