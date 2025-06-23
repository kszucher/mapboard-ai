import { gDefault, lDefault, rDefault } from '../state/map-defaults';
import { G, L, M, R } from '../state/map-types';

// Strict normalizer that filters unknown fields
function strictNormalize<T extends object>(input: unknown, defaults: T): T {
  const result = {} as T;

  if (typeof input === 'object' && input !== null) {
    for (const key in defaults) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        result[key] = (input as Record<string, unknown>)[key] as T[typeof key];
      } else {
        result[key] = defaults[key];
      }
    }
  } else {
    return { ...defaults };
  }

  return result;
}

const normalizeToG = (g: unknown): G => strictNormalize(g, gDefault);
const normalizeToL = (l: unknown): L => strictNormalize(l, lDefault);
const normalizeToR = (r: unknown): R => strictNormalize(r, rDefault);

export const normalizeM = (overlap: unknown): M => {
  const o = typeof overlap === 'object' && overlap !== null
    ? overlap as Record<string, unknown>
    : {};

  const rawL = typeof o.l === 'object' && o.l !== null ? o.l as Record<string, unknown> : {};
  const rawR = typeof o.r === 'object' && o.r !== null ? o.r as Record<string, unknown> : {};

  const normalizedL: Record<string, L> = Object.fromEntries(
    Object.entries(rawL).map(([key, value]) => [key, normalizeToL(value)]),
  );

  const normalizedR: Record<string, R> = Object.fromEntries(
    Object.entries(rawR).map(([key, value]) => [key, normalizeToR(value)]),
  );

  return {
    g: normalizeToG(o.g),
    l: normalizedL,
    r: normalizedR,
  };
};
