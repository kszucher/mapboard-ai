import { ControlType, M, MPartial } from '../state/map-state-types';
import { _assert } from './_assert';
import { mapInsert } from './map-insert';

describe('MapInsertTests', () => {
  beforeEach(() => {
  });
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
