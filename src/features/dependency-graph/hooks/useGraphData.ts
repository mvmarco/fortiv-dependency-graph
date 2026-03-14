import { useMemo } from 'react';
import type { RawGraph } from '../types/graph';
import { transformGraph } from '../lib/transformGraph';
import rawGraph from '../../../../data/graph.json';

export function useGraphData(
  version: number,
  sortActivitiesByPriority: boolean,
  sortResourcesByDependencyCount: boolean,
) {
  return useMemo(
    () =>
      transformGraph(rawGraph as RawGraph, {
        sortActivitiesByPriority,
        sortResourcesByDependencyCount,
      }),
    // version is intentionally included to allow callers to force a re-derive
    // (e.g. the Reload button) without changing sort options.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version, sortActivitiesByPriority, sortResourcesByDependencyCount],
  );
}
