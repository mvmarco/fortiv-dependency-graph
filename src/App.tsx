import { useState } from 'react';
import { useGraphData } from './features/dependency-graph/hooks/useGraphData';
import { GraphCanvas } from './features/dependency-graph/components/GraphCanvas';
import { DetailPanel } from './features/dependency-graph/components/DetailPanel';

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-slate-800 bg-slate-800 text-white'
          : 'border-slate-300 bg-white text-slate-600 hover:border-slate-500 hover:text-slate-800',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function App() {
  const [version, setVersion] = useState(0);
  const [sortActivities, setSortActivities] = useState(false);
  const [sortResources, setSortResources] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const { nodes, edges } = useGraphData(version, sortActivities, sortResources);

  // Changing the graph structure remounts GraphCanvas so React Flow reinitialises
  // with the new node positions and re-runs fitView.
  const graphKey = `${version}:${sortActivities}:${sortResources}`;

  const selectedNode = selectedNodeId
    ? (nodes.find((n) => n.id === selectedNodeId) ?? null)
    : null;

  function handleReload() {
    setVersion((v) => v + 1);
    setSelectedNodeId(null);
  }

  function handleToggleSortActivities() {
    setSortActivities((v) => !v);
    setSelectedNodeId(null);
  }

  function handleToggleSortResources() {
    setSortResources((v) => !v);
    setSelectedNodeId(null);
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-base font-semibold text-slate-900">Dependency Graph</h1>
            <p className="text-xs text-slate-500">
              Business activities and their resource dependencies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ToggleButton active={sortActivities} onClick={handleToggleSortActivities}>
              Activities by priority
            </ToggleButton>
            <ToggleButton active={sortResources} onClick={handleToggleSortResources}>
              Resources by connectivity
            </ToggleButton>
            <div className="mx-1 h-4 w-px bg-slate-200" />
            <button
              onClick={handleReload}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-800"
            >
              Reload
            </button>
          </div>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <main className="min-h-0 flex-1">
          <GraphCanvas
            key={graphKey}
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
