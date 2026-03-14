import type { ReactNode } from 'react';
import type { AppNode, Priority, ResourceType } from '../types/graph';

const PRIORITY_BADGE: Record<Priority, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-sky-100 text-sky-700',
};

const RESOURCE_TYPE_LABEL: Record<ResourceType, string> = {
  technology: 'Technology',
  third_party: 'Third Party',
  people: 'People',
  building: 'Building',
  equipment: 'Equipment',
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-0.5 text-sm text-slate-800">{children}</div>
    </div>
  );
}

interface Props {
  node: AppNode;
  onClose: () => void;
}

export function DetailPanel({ node, onClose }: Props) {
  const { data } = node;

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {data.kind === 'activity' ? 'Activity' : 'Resource'}
        </span>
        <button
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{data.name}</h2>

        <dl className="mt-4 space-y-4">
          {data.kind === 'activity' ? (
            <>
              <Row label="Priority">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-semibold capitalize ${PRIORITY_BADGE[data.priority]}`}
                >
                  {data.priority}
                </span>
              </Row>
              <Row label="Owner">{data.owner}</Row>
              <Row label="Recovery Time Objective">
                {data.rto_hours} {data.rto_hours === 1 ? 'hour' : 'hours'}
              </Row>
            </>
          ) : (
            <>
              <Row label="Resource Type">{RESOURCE_TYPE_LABEL[data.resource_type]}</Row>
              <Row label="Contact">{data.contact}</Row>
              {data.vendor !== undefined && <Row label="Vendor">{data.vendor}</Row>}
              <Row label="Single Point of Failure">
                {data.isSPOF ? (
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                    <span className="font-medium text-red-700">
                      Yes &mdash; {data.dependencyCount} dependent{' '}
                      {data.dependencyCount === 1 ? 'node' : 'nodes'}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-500">No</span>
                )}
              </Row>
            </>
          )}
        </dl>
      </div>
    </aside>
  );
}
