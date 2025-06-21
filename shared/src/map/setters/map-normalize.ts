import { gDefault, lDefault, rDefault } from '../state/map-defaults';
import { G, L, M, R } from '../state/map-types';

const normalizeToG = (g: unknown): G =>
  typeof g === 'object' && g !== null
    ? { ...gDefault, ...g as Record<string, any> }
    : { ...gDefault };

const normalizeToL = (l: unknown): L =>
  typeof l === 'object' && l !== null
    ? { ...lDefault, ...l as Record<string, any> }
    : { ...lDefault };

const normalizeToR = (r: unknown): R =>
  typeof r === 'object' && r !== null
    ? { ...rDefault, ...r as Record<string, any> }
    : { ...rDefault };

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
