import { M, MPartial, Side } from '../state/map-state-types';
import { _assert } from './_assert';
import { mapDelete } from './map-delete';

describe('MapDeleteTests', () => {
  test('deleteLR', () => {
    const test: MPartial = [
      { nodeId: 'g', path: ['g'] },
      {
        nodeId: 'l0',
        path: ['l', 0],
        fromNodeId: 'r0',
        fromNodeSide: Side.L,
        toNodeId: 'r1',
        toNodeSide: Side.R,
      },
      {
        nodeId: 'l1',
        path: ['l', 1],
        fromNodeId: 'r0',
        fromNodeSide: Side.L,
        toNodeId: 'r2',
        toNodeSide: Side.R,
      },
      {
        nodeId: 'l2',
        path: ['l', 2],
        fromNodeId: 'r1',
        fromNodeSide: Side.L,
        toNodeId: 'r2',
        toNodeSide: Side.R,
      },
      { nodeId: 'r0', path: ['r', 0], offsetW: 120, offsetH: 230 },
      { nodeId: 'r1', path: ['r', 1], offsetW: 340, offsetH: 450 },
      { nodeId: 'r2', path: ['r', 2], offsetW: 560, offsetH: 780 },
    ];
    const result: MPartial = [
      { nodeId: 'g', path: ['g'] },
      {
        nodeId: 'l1',
        path: ['l', 0],
        fromNodeId: 'r0',
        fromNodeSide: Side.L,
        toNodeId: 'r2',
        toNodeSide: Side.R,
      },
      { nodeId: 'r0', path: ['r', 0] },
      { nodeId: 'r2', path: ['r', 1], offsetW: 440, offsetH: 550 },
    ];
    _assert(test, result, (m: M) => mapDelete.LR(m, 'r1'));
  });
});
