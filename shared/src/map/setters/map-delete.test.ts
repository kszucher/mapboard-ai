import { lDefault, rDefault } from '../state/map-defaults';
import { M, Side } from '../state/map-types';
import { mapDelete } from './map-delete';

describe('MapDeleteTests', () => {
  test('deleteLR', () => {
    const test: M = {
      g: { isLocked: false },
      l: {
        l0: {
          ...lDefault,
          fromNodeId: 'r0',
          fromNodeSide: Side.L,
          toNodeId: 'r1',
          toNodeSide: Side.R,
        },
        l1: {
          ...lDefault,
          fromNodeId: 'r0',
          fromNodeSide: Side.L,
          toNodeId: 'r2',
          toNodeSide: Side.R,
        },
        l2: {
          ...lDefault,
          fromNodeId: 'r1',
          fromNodeSide: Side.L,
          toNodeId: 'r2',
          toNodeSide: Side.R,
        },
      },
      r: {
        r0: {
          ...rDefault,
          iid: 0,
          offsetW: 120,
          offsetH: 230,
        },
        r1: {
          ...rDefault,
          iid: 1,
          offsetW: 340,
          offsetH: 450,
        },
        r2: {
          ...rDefault,
          iid: 2,
          offsetW: 560,
          offsetH: 780,
        },
      },
    };
    const result: M = {
      g: { isLocked: false },
      l: {
        l1: {
          ...lDefault,
          fromNodeId: 'r0',
          fromNodeSide: Side.L,
          toNodeId: 'r2',
          toNodeSide: Side.R,
        },
      },
      r: {
        r0: {
          ...rDefault,
          iid: 0,
        },
        r2: {
          ...rDefault,
          iid: 2,
          offsetW: 440,
          offsetH: 550,
        },
      },
    };
    mapDelete.LR(test, 'r1');
    expect(test).toMatchObject(result);
  });
});
