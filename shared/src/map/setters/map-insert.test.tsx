import { N_PADDING } from '../state/map-consts';
import { nDefault } from '../state/map-defaults';
import { M } from '../state/map-types';
import { mapInsert } from './map-insert';

describe('MapInsertTests', () => {
  test('insertR', () => {
    const test: M = {
      l: {},
      n: { a: { ...nDefault, iid: 0 } },
    };
    const result: M = {
      l: {},
      n: {
        a: { ...nDefault, iid: 0 },
        b: {
          ...nDefault,
          iid: 1,
          offsetW: nDefault.selfW + 2 * N_PADDING,
          offsetH: nDefault.selfH + 2 * N_PADDING,
        },
      },
    };
    mapInsert.N(test, nDefault.controlType, () => 'b');
    expect(test).toMatchObject(result);
  });
});
