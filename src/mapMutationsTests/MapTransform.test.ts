import { mapMutations } from '../mapMutations/MapMutations.ts';
import { M, MPartial } from '../mapState/MapStateTypes.ts';
import { Side } from '../mapState/MapStateTypesEnums.ts';
import { _assert } from './_assert.ts';

describe('MapTransformTests', () => {
  beforeEach(() => {});
  test('duplicateLR', () => {
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
        fromNodeId: 'r0',
        fromNodeSide: Side.L,
        toNodeId: 'r3',
        toNodeSide: Side.R,
      },
      {
        nodeId: 'l3',
        path: ['l', 3],
        fromNodeId: 'r1',
        fromNodeSide: Side.L,
        toNodeId: 'r2',
        toNodeSide: Side.R,
      },
      { nodeId: 'r0', path: ['r', 0] },
      { nodeId: 'r1', path: ['r', 1], selected: 1, offsetW: 100, offsetH: 200 },
      { nodeId: 'r2', path: ['r', 2], selected: 2, offsetW: 110, offsetH: 220 },
      { nodeId: 'r3', path: ['r', 3] },
    ];
    const result: MPartial = [
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
        fromNodeId: 'r0',
        fromNodeSide: Side.L,
        toNodeId: 'r3',
        toNodeSide: Side.R,
      },
      {
        nodeId: 'l3',
        path: ['l', 3],
        fromNodeId: 'r1',
        fromNodeSide: Side.L,
        toNodeId: 'r2',
        toNodeSide: Side.R,
      },
      {
        nodeId: '_l4',
        path: ['l', 4],
        fromNodeId: '_r4',
        fromNodeSide: Side.L,
        toNodeId: '_r5',
        toNodeSide: Side.R,
      },
      { nodeId: 'r0', path: ['r', 0] },
      { nodeId: 'r1', path: ['r', 1], offsetW: 100, offsetH: 200 },
      { nodeId: 'r2', path: ['r', 2], offsetW: 110, offsetH: 220 },
      { nodeId: 'r3', path: ['r', 3] },
      { nodeId: '_r4', path: ['r', 4], selected: 1 },
      { nodeId: '_r5', path: ['r', 5], selected: 2, offsetW: 10, offsetH: 20 },
    ];
    _assert(test, result, (m: M) => mapMutations.duplicateLR(m));
  });
});
