import { M, N_PADDING } from '../state/map-consts-and-types';
import { nDefault } from '../state/map-defaults';
import { mapInsert } from './map-insert';

describe('MapInsertTests', () => {
  test('insertN', () => {
    const test: M = {
      l: {},
      n: { n0: { ...nDefault, iid: 0 } },
    };
    const result: M = {
      l: {},
      n: {
        n0: { ...nDefault, iid: 0 },
        n1: {
          ...nDefault,
          iid: 1,
          offsetW: nDefault.selfW + 2 * N_PADDING,
          offsetH: nDefault.selfH + 2 * N_PADDING,
          selfW: nDefault.selfW,
          selfH: nDefault.selfH,
        },
      },
    };
    mapInsert.N(test, nDefault.controlType, () => 'n1');
    expect(test).toMatchObject(result);
  });
});
