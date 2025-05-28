import { R_PADDING } from '../state/map-consts';
import { rDefault } from '../state/map-defaults';
import { M } from '../state/map-types';
import { mapInsert } from './map-insert';

describe('MapInsertTests', () => {
  test('insertR', () => {
    const test: M = {
      g: { isLocked: false },
      l: {},
      r: { a: { ...rDefault, iid: 0 } },
    };
    const result: M = {
      g: { isLocked: false },
      l: {},
      r: {
        a: { ...rDefault, iid: 0 },
        b: {
          ...rDefault,
          iid: 1,
          offsetW: rDefault.selfW + 2 * R_PADDING,
          offsetH: rDefault.selfH + 2 * R_PADDING,
        },
      },
    };
    mapInsert.R(test, rDefault.controlType, () => 'b');
    expect(test).toMatchObject(result);
  });
});
