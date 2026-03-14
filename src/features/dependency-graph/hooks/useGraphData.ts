import { useMemo } from 'react';
import type { RawGraph } from '../types/graph';
import { transformGraph } from '../lib/transformGraph';
import rawGraph from '../../../../data/graph.json';

export function useGraphData() {
  return useMemo(() => transformGraph(rawGraph as RawGraph), []);
}
