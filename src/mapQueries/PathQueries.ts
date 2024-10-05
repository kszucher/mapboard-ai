import {sortablePath} from "../mapMutations/MapSort.ts"
import {P, PT} from "../mapState/MapStateTypes.ts"

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
export const isT = (p: P): boolean => p.at(0) !== 'g'

export const isQuasiSD = (p: PT, pt: PT): boolean => p.length === pt.length && sortablePath(pt) > sortablePath(p)
export const isQuasiSU = (p: PT, pt: PT): boolean => p.length === pt.length && sortablePath(pt) < sortablePath(p)
