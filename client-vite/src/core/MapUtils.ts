import {GN, ML, Path, PathItem} from "../state/MTypes"
import {N} from "../state/NPropsTypes"
import {isArrayOfEqualValues} from "./Utils"
import {G} from "../state/GPropsTypes"

// LINEAR
export const getNodeById = (ml: ML, nodeId: string) => (ml.find((n: GN) => n.nodeId === nodeId))
export const getNodeByPath = (ml: ML, path: Path) => (ml.find((n: GN) => isSamePath(n.path, path)))
export const getPathPattern = (path: Path) => path.filter((el: PathItem) => isNaN(el as any)).join('')
export const getParentPath = (path: Path) => {
  switch (getPathPattern(path).at(-1)) {
    case 'd': return path.slice(0, -2)
    case 's': return path.slice(0, -2)
    case 'c': return path.slice(0, -3)
    default: return path
  }
}
export const isSamePath = (p: Path, pt: Path) => p.join('') === pt.join('')
export const isSubPath = (p: Path, pt: Path) => pt.length > p.length && p.join('') === pt.slice(0, p.length).join('')
export const endsWithPathPattern = (path: Path, pattern: string) => getPathPattern(path).slice(-pattern.length) === pattern
export const getG = (ml: ML) => ml.filter((n: N) => n.path.length === 1).at(0) as G
export const sFinder = (ml: ML) =>  ml.filter((n: N) => getG(ml).sc.structSelectedPathList.some((sp: Path) => isSamePath(sp, n.path)))
export const fFinder = (ml: ML) => ml.filter((n: N) => getG(ml).sc.structSelectedPathList.some((sp: Path) => isSamePath(sp, n.path) || isSubPath(sp, n.path) && n.type === 'struct'))
export const sGetter = (ml: ML, prop: keyof N) => {
  const g = getG(ml)
  const ln = getNodeByPath(ml, g.sc.lastPath) as N
  return isArrayOfEqualValues(sFinder(ml).map((n: N) => n[prop])) ? ln[prop] : null
}
export const fGetter = (ml: ML, prop: keyof N) => {
  const g = getG(ml)
  const ln = getNodeByPath(ml, g.sc.lastPath) as N
  return isArrayOfEqualValues(fFinder(ml).map((n: N) => n[prop])) ? ln[prop] : null
}
export const sSetter  = (ml: ML, prop: keyof N, value: any) => { for (const n of sFinder(ml)) { Object.assign(n, { [prop]: value }) } }
export const fSetter  = (ml: ML, prop: keyof N, value: any) => { for (const n of fFinder(ml)) { Object.assign(n, { [prop]: value }) } }
// NESTED
export const getDefaultNode = (attributes?: any) => ({d: [], s: [], c: [[]], content: '', ...attributes})
