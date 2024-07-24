import {P, PT} from "../state/MapStateTypes.ts"
import isEqual from "react-fast-compare"

export const sortablePath = (p: P): string => p.map((pi: any) => isNaN(pi) ? pi : 1000 + pi).join('')

export const getPathPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')

export const isG = (p: P): boolean => p.at(0) === 'g'
export const isL = (p: P): boolean => p.at(0) === 'l'
export const isR = (p: P): boolean => p.at(-2) === 'r'
export const isS = (p: P): boolean => p.at(-2) === 's'
export const isRS = (p: P): boolean => p.at(-4) === 'r' && p.at(-2) === 's'
export const isSS = (p: P): boolean => p.at(-4) === 's' && p.at(-2) === 's'
export const isCS = (p: P): boolean => p.at(-5) === 'c' && p.at(-2) === 's'
export const isC = (p: P): boolean => p.at(-3) === 'c'
export const isRSC = (p: P): boolean => p.at(-7) === 'r' && p.at(-5) === 's' && p.at(-3) === 'c'
export const isSSC = (p: P): boolean => p.at(-7) === 's' && p.at(-5) === 's' && p.at(-3) === 'c'

const isOfSameR = (p: PT, pt: PT): boolean => pt.at(1) === p.at(1)
const isOfSameC = (p: PT, pt: PT): boolean => isEqual(p.slice(0, p.findLastIndex(pi => pi === 'c') + 3), pt.slice(0, pt.findLastIndex(pti => pti === 'c') + 3))

export const isQuasiSD = (p: PT, pt: PT): boolean => isOfSameR(p, pt) && isOfSameC(p, pt) && sortablePath(pt) > sortablePath(p) && getPathPattern(pt) === getPathPattern(p)
export const isQuasiSU = (p: PT, pt: PT): boolean => isOfSameR(p, pt) && isOfSameC(p, pt) && sortablePath(pt) < sortablePath(p) && getPathPattern(pt) === getPathPattern(p)

export const isREO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)
export const isSEO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)
export const isCEO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)
export const isRDO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) > p.at(-1)
export const isSEODO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) >= p.at(-1)
export const isCEODO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) >= p.at(-1)
export const isCD = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) > p.at(-2)! && pt.at(p.length - 1) === p.at(-1)
export const isCR = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) === p.at(-2)! && pt.at(p.length - 1) > p.at(-1)
