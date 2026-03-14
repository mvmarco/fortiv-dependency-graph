import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ResourceFlowNode as ResourceFlowNodeType, ResourceType } from '../../types/graph';

const TYPE_STYLES: Record<ResourceType, { border: string; badge: string; label: string }> = {
  technology:  { border: 'border-l-blue-500',   badge: 'bg-blue-100 text-blue-700',     label: 'Technology' },
  third_party: { border: 'border-l-violet-500', badge: 'bg-violet-100 text-violet-700', label: 'Third Party' },
  people:      { border: 'border-l-emerald-500',badge: 'bg-emerald-100 text-emerald-700',label: 'People' },
  building:    { border: 'border-l-amber-500',  badge: 'bg-amber-100 text-amber-700',   label: 'Building' },
  equipment:   { border: 'border-l-slate-400',  badge: 'bg-slate-100 text-slate-600',   label: 'Equipment' },
};

export function ResourceFlowNode({ data, selected }: NodeProps<ResourceFlowNodeType>) {
  const s = TYPE_STYLES[data.resource_type];
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div
        className={[
          'w-44 rounded bg-white border border-l-4 shadow-sm px-3 py-2',
          s.border,
          selected ? 'border-slate-400 ring-2 ring-slate-300' : 'border-slate-200',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-1">
          <p className="text-xs font-semibold text-slate-800 leading-snug">{data.name}</p>
          {data.isSPOF && (
            <span className="shrink-0 rounded border border-red-200 bg-red-50 px-1 py-0.5 text-[9px] font-bold text-red-600">
              SPOF
            </span>
          )}
        </div>
        <span className={`mt-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${s.badge}`}>
          {s.label}
        </span>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
