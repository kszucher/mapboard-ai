import { jsonMerge } from './json-merge';

describe('jsonMerge', () => {
  it('merges complex nested objects with nulls and overrides', () => {
    const version_original = {
      s: { a: 'vo' },
      t: { a: 'vo', b: 'vo', c: 'vo' },
      u: { a: 'vo' },
    };
    const delta = {
      t: { b: 'vd', c: null, d: 'vd' },
      u: null,
      v: { a: 'vd' },
    };
    const expected = {
      s: { a: 'vo' },
      t: { a: 'vo', b: 'vd', d: 'vd' },
      v: { a: 'vd' },
    };

    expect(jsonMerge(version_original, delta)).toEqual(expected);
  });
});
