import { mapInsert } from './MapInsert.ts';
import { M, MPartial } from '../mapState/MapStateTypes.ts';
import { ControlType } from '../mapState/MapStateTypesEnums.ts';
import { _assert } from './_assert.ts';

describe('MapInsertTests', () => {
  beforeEach(() => {});
  test('insertR', () => {
    const test: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0] },
    ];
    const result: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0] },
      { nodeId: '_r1', path: ['r', 1] },
    ];
    _assert(test, result, (m: M) => mapInsert.R(m, ControlType.FILE));
  });
});
