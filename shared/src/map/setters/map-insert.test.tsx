import { ControlType, M, MPartial } from '../state/map-types';
import { mapInsert } from './map-insert';

describe('MapInsertTests', () => {
  test('insertR', () => {
    const test: MPartial = {
      g: {},
      l: {},
      r: { a: { iid: 0 } },
    };
    const result: MPartial = {
      g: {},
      l: {},
      r: { a: { iid: 0 }, b: { iid: 1 } },
    };
    mapInsert.R(test as M, ControlType.FILE, () => 'b');
    expect(test).toMatchObject(result);
  });
});
