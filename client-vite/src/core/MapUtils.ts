import {GN, ML, Path, PathItem} from "../state/MTypes"
import {N} from "../state/NPropsTypes"
import {isArrayOfEqualValues} from "./Utils"
import {G} from "../state/GPropsTypes"

export const getPathPattern = (p: Path) => p.filter((el: PathItem) => isNaN(el as any)).join('')
export const endsWithPathPattern = (p: Path, pattern: string) => getPathPattern(p).endsWith(pattern)
export const getParentPath = (p: Path) => (endsWithPathPattern(p, 'd') || endsWithPathPattern(p, 's')) ? p.slice(0, -2) : p.slice(0, -3)
export const getStructParentPath = (p: Path) => (endsWithPathPattern(p, 'ds') || endsWithPathPattern(p, 'ss')) ? p.slice(0, -2) : p.slice(0, -5)
export const isG = (p: Path) => getPathPattern(p).endsWith('g')
export const isR = (p: Path) => getPathPattern(p).endsWith('r')
export const isD = (p: Path) => getPathPattern(p).endsWith('d')
export const isS = (p: Path) => getPathPattern(p).endsWith('s')
export const isC = (p: Path) => getPathPattern(p).endsWith('c')
export const isSamePath = (p: Path, pt: Path) => p.join('') === pt.join('')
export const isSubPath = (p: Path, pt: Path) => pt.length > p.length && p.join('') === pt.slice(0, p.length).join('')
export const getNodeById = (ml: ML, nodeId: string) => (ml.find((n: GN) => n.nodeId === nodeId))
export const getNodeByPath = (ml: ML, p: Path) => (ml.find((n: GN) => isSamePath(n.path, p))) as GN
export const getG = (ml: ML) => ml.filter((n: N) => n.path.length === 1).at(0) as G
export const getLN = (ml: ML) => getNodeByPath(ml, getG(ml).sc.lastPath) as N
export const sFinder = (ml: ML) =>  ml.filter((n: N) => getG(ml).sc.structSelectedPathList.some((sp: Path) => isSamePath(sp, n.path)))
export const fFinder = (ml: ML) => ml.filter((n: N) => getG(ml).sc.structSelectedPathList.some((sp: Path) => isSamePath(sp, n.path) || isSubPath(sp, n.path) && isS(n.path)))
export const sGetter = (ml: ML, prop: keyof N) => isArrayOfEqualValues(sFinder(ml).map((n: N) => n[prop])) ? getLN(ml)[prop] : null
export const fGetter = (ml: ML, prop: keyof N) => isArrayOfEqualValues(fFinder(ml).map((n: N) => n[prop])) ? getLN(ml)[prop] : null
export const sSetter  = (ml: ML, prop: keyof N, value: any) => { for (const n of sFinder(ml)) { Object.assign(n, { [prop]: value }) } }
export const fSetter  = (ml: ML, prop: keyof N, value: any) => { for (const n of fFinder(ml)) { Object.assign(n, { [prop]: value }) } }

// WILL BE REMOVED
export const getDefaultNode = (attributes?: any) => ({d: [], s: [], c: [[]], content: '', ...attributes})
