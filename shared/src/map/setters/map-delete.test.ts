import { lDefault, rDefault } from '../state/map-defaults';
import { M } from '../state/map-types';
import { mapDelete } from './map-delete';

describe('MapDeleteTests', () => {
  test('deleteLR', () => {
    const test: M = {
      g: { isLocked: false },
      l: {
        l0: {
          ...lDefault,
          fromNodeId: 'r0',
          toNodeId: 'r1',
        },
        l1: {
          ...lDefault,
          fromNodeId: 'r0',
          toNodeId: 'r2',
        },
        l2: {
          ...lDefault,
          fromNodeId: 'r1',
          toNodeId: 'r2',
        },
      },
      r: {
        r0: {
          ...rDefault,
          iid: 0,
        },
        r1: {
          ...rDefault,
          iid: 1,
        },
        r2: {
          ...rDefault,
          iid: 2,
        },
      },
    };
    const result: M = {
      g: { isLocked: false },
      l: {
        l1: {
          ...lDefault,
          fromNodeId: 'r0',
          toNodeId: 'r2',
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
        },
      },
    };
    mapDelete.LR(test, 'r1');
    expect(test).toMatchObject(result);
  });
});
