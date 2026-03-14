import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ActivityFlowNode as ActivityFlowNodeType, Priority } from '../../types/graph';

const PRIORITY_STYLES: Record<Priority, { border: string; badge: string; label: string }> = {
  critical: { border: 'border-l-red-500',    badge: 'bg-red-100 text-red-700',    label: 'Critical' },
  high:     { border: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-700', label: 'High' },
  medium:   { border: 'border-l-sky-500',    badge: 'bg-sky-100 text-sky-700',    label: 'Medium' },
};

export function ActivityFlowNode({ data, selected }: NodeProps<ActivityFlowNodeType>) {
  const s = PRIORITY_STYLES[data.priority];
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div
        className={[
          'w-48 rounded bg-white border border-l-4 shadow-sm px-3 py-2',
          s.border,
          selected ? 'border-slate-400 ring-2 ring-slate-300' : 'border-slate-200',
        ].join(' ')}
      >
        <p className="text-xs font-semibold text-slate-800 leading-snug">{data.name}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${s.badge}`}>
            {s.label}
          </span>
          <span className="text-[10px] text-slate-500">RTO {data.rto_hours}h</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
