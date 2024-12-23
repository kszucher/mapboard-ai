import { P } from '../mapState/MapStateTypes.ts';

export const isG = (p: P): boolean => p.at(0) === 'g';
export const isL = (p: P): boolean => p.at(0) === 'l';
export const isR = (p: P): boolean => p.at(-2) === 'r';
