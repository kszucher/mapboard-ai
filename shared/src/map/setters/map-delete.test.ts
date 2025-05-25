import { M, MPartial, Side } from '../state/map-types';
import { mapDelete } from './map-delete';

describe('MapDeleteTests', () => {
  test('deleteLR', () => {
    const test: MPartial = {
      g: {},
      l: {
        l0: {
          fromNodeId: 'r0',
          fromNodeSide: Side.L,
          toNodeId: 'r1',
          toNodeSide: Side.R,
        },
        l1: {
          fromNodeId: 'r0',
          fromNodeSide: Side.L,
          toNodeId: 'r2',
          toNodeSide: Side.R,
        },
        l2: {
          fromNodeId: 'r1',
          fromNodeSide: Side.L,
          toNodeId: 'r2',
          toNodeSide: Side.R,
        },
      },
      r: {
        r0: {
          iid: 0,
          offsetW: 120,
          offsetH: 230,
        },
        r1: {
          iid: 1,
          offsetW: 340,
          offsetH: 450,
        },
        r2: {
          iid: 2,
          offsetW: 560,
          offsetH: 780,
        },
      },
    };
    const result: MPartial = {
      g: {},
      l: {
        l1: {
          fromNodeId: 'r0',
          fromNodeSide: Side.L,
          toNodeId: 'r2',
          toNodeSide: Side.R,
        },
      },
      r: {
        r0: {
          iid: 0,

        },
        r2: {
          iid: 2,
          offsetW: 440,
          offsetH: 550,
        },
      },
    };
    mapDelete.LR(test as M, 'r1');
    expect(test).toMatchObject(result);
  });
});
