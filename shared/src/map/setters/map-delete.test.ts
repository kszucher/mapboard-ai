import { lDefault, nDefault } from '../state/map-defaults';
import { M } from '../state/map-types';
import { mapDelete } from './map-delete';

describe('MapDeleteTests', () => {
  test('deleteLR', () => {
    const test: M = {
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
      n: {
        [0]: {
          ...nDefault,
          iid: 0,
        },
        r1: {
          ...nDefault,
          iid: 1,
        },
        r2: {
          ...nDefault,
          iid: 2,
        },
      },
    };
    const result: M = {
      l: {
        l1: {
          ...lDefault,
          fromNodeId: 'r0',
          toNodeId: 'r2',
        },
      },
      n: {
        r0: {
          ...nDefault,
          iid: 0,
        },
        r2: {
          ...nDefault,
          iid: 2,
        },
      },
    };
    mapDelete.NL(test, 'r1');
    expect(test).toMatchObject(result);
  });
});
