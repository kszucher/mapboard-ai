import { R_SELF_H_MIN, R_SELF_W_MIN, R_SPACING } from '../mapConsts/MapConsts.ts';
import { mapMutations } from '../mapMutations/MapMutations.ts';
import { M, MPartial } from '../mapState/MapStateTypes.ts';
import { _assert } from './_assert.ts';

describe('MapInsertTests', () => {
  beforeEach(() => {});
  test('insertRR', () => {
    const test: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0], selected: 1 },
    ];
    const result: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0] },
      { nodeId: '_r1', path: ['r', 1], selected: 1, offsetW: R_SPACING },
    ];
    _assert(test, result, (m: M) => mapMutations.insertRR(m));
  });
  test('insertRL', () => {
    const test: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0], selected: 1 },
    ];
    const result: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0] },
      {
        nodeId: '_r1',
        path: ['r', 1],
        selected: 1,
        offsetW: -R_SPACING - R_SELF_W_MIN,
      },
    ];
    _assert(test, result, (m: M) => mapMutations.insertRL(m));
  });
  test('insertRD', () => {
    const test: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0], selected: 1 },
    ];
    const result: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0] },
      { nodeId: '_r1', path: ['r', 1], selected: 1, offsetH: R_SPACING },
    ];
    _assert(test, result, (m: M) => mapMutations.insertRD(m));
  });
  test('insertRU', () => {
    const test: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0], selected: 1 },
    ];
    const result: MPartial = [
      { nodeId: 'g', path: ['g'] },
      { nodeId: 'r0', path: ['r', 0] },
      {
        nodeId: '_r1',
        path: ['r', 1],
        selected: 1,
        offsetH: -R_SPACING - R_SELF_H_MIN,
      },
    ];
    _assert(test, result, (m: M) => mapMutations.insertRU(m));
  });
});
