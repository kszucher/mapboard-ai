import { M } from '../state/map-consts-and-types';
import { lDefault, nDefault } from '../state/map-defaults';
import { mapDelete } from './map-delete';

describe('MapDeleteTests', () => {
  test('deleteNL', () => {
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
        n0: {
          ...nDefault,
          iid: 0,
        },
        n1: {
          ...nDefault,
          iid: 1,
        },
        n2: {
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
        n0: {
          ...nDefault,
          iid: 0,
        },
        n2: {
          ...nDefault,
          iid: 2,
        },
      },
    };
    mapDelete.NL(test, 'n1');
    expect(test).toMatchObject(result);
  });
});
