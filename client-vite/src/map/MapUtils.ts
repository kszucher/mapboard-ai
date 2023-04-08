import {GN, M, Path, PathItem} from "../state/MTypes"
import {N} from "../state/NPropsTypes"
import {isArrayOfEqualValues} from "../core/Utils"
import {G} from "../state/GPropsTypes"
import isEqual from "react-fast-compare";

export const pathSorter = (a, b) => a.path.map(el => isNaN(el) ? el: 1000 + el).join('') > b.path.map(el => isNaN(el) ? el: 1000 + el).join('') ? 1 : -1
export const nodeSorter = (a, b) => a.nodeId > b.nodeId ? 1 : -1
export const getPattern = (p: Path) => p.filter((el: PathItem) => isNaN(el as any)).join('')
export const getParentPath = (p: Path) => (getPattern(p).endsWith('d') || getPattern(p).endsWith('s')) ? p.slice(0, -2) : p.slice(0, -3)
export const getStructParentPath = (p: Path) => (getPattern(p).endsWith('ds') || getPattern(p).endsWith('ss')) ? p.slice(0, -2) : p.slice(0, -5)
export const isG = (p: Path) => getPattern(p).endsWith('g')
export const isR = (p: Path) => getPattern(p).endsWith('r')
export const isD = (p: Path) => getPattern(p).endsWith('d')
export const isS = (p: Path) => getPattern(p).endsWith('s')
export const isC = (p: Path) => getPattern(p).endsWith('c')
export const isSubPath = (p: Path, pt: Path) => pt.length > p.length && isEqual(p, pt.slice(0, p.length))
export const isUpperSiblingPath = (p: Path, pt: Path) => pt.length === p.length && isEqual(p.slice(0, p.length - 1), pt.slice(0, pt.length - 1)) && p.at(-1) > pt.at(-1)
export const getNodeById = (m: M, nodeId: string) => (m.find((n: GN) => n.nodeId === nodeId)) as GN // TODO remove this
export const getNodeByPath = (m: M, p: Path) => (m.find((n: GN) => isEqual(n.path, p))) as GN
export const getParentNodeByPath = (m: M, p: Path) => getNodeByPath(m, getParentPath(p)) as N
export const haveSameParent = (p: Path, pt: Path) => isEqual(getParentPath(p), getParentPath(pt))
export const getG = (m: M) => m.filter((n: N) => n.path.length === 1).at(0) as G
export const getLN = (m: M) => getNodeByPath(m, getG(m).sc.lastPath) as N
export const sFinder = (m: M) => m.filter((n: N) => getG(m).sc.structSelectedPathList.some((sp: Path) => isEqual(sp, n.path)))
export const fFinder = (m: M) => m.filter((n: N) => getG(m).sc.structSelectedPathList.some((sp: Path) => isEqual(sp, n.path) || isSubPath(sp, n.path) && isS(n.path)))
export const sGetter = (m: M, prop: keyof N) => isArrayOfEqualValues(sFinder(m).map((n: N) => n[prop])) ? getLN(m)[prop] : null
export const fGetter = (m: M, prop: keyof N) => isArrayOfEqualValues(fFinder(m).map((n: N) => n[prop])) ? getLN(m)[prop] : null
export const sSetter = (m: M, prop: keyof N, value: any) => sFinder(m).forEach(n => n[prop] = value)
export const fSetter = (m: M, prop: keyof N, value: any) => fFinder(m).forEach(n => n[prop] = value)

// WILL BE REMOVED
export const getDefaultNode = (attributes?: any) => ({d: [], s: [], c: [[]], content: '', ...attributes})
