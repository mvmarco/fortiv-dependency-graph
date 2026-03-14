import { GraphCanvas } from './features/dependency-graph/components/GraphCanvas';

function App() {
  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
        <h1 className="text-base font-semibold text-slate-900">Dependency Graph</h1>
        <p className="text-xs text-slate-500">Business activities and their resource dependencies</p>
      </header>
      <main className="min-h-0 flex-1">
        <GraphCanvas />
      </main>
    </div>
  );
}

export default App;
