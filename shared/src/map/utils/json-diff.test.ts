import { jsonDiff } from './json-diff';

describe('jsonDiff', () => {
  it('should compute the diff for nested objects with adds, changes, and removals', () => {
    const version_original = {
      s: { a: 'vo' },
      t: { a: 'vo', b: 'vo', c: 'vo' },
      u: { a: 'vo' },
    };
    const version_a = {
      s: { a: 'vo' },
      t: { a: 'vo', b: 'vd', d: 'vd' },
      v: { a: 'vd' },
    };
    const expected = { // original + diff = a --> diff = a - original
      t: { b: 'vd', c: null, d: 'vd' },
      u: null,
      v: { a: 'vd' },
    };

    expect(jsonDiff(version_a, version_original)).toEqual(expected);
  });
});
