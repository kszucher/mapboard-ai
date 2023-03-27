import {isEqual} from "./Utils"
import {GN, ML, Path, PathItem} from "../state/MTypes"

// LINEAR
export const getNodeById = (ml: ML, nodeId: string) => (ml.find((n: GN) => n.nodeId === nodeId))
export const getNodeByPath = (ml: ML, path: Path) => (ml.find((n: GN) => n.path.join('') === path.join('')))
export const isSubNode = (p: Path, pt: Path) => pt.length > p.length && isEqual(p, pt.slice(0, p.length))
export const getPathPattern = (path: Path) => path.filter((el: PathItem) => isNaN(el as any)).join('')
export const endsWithPathPattern = (path: Path, pattern: string) => getPathPattern(path).slice(-pattern.length) === pattern
export const getParentPath = (path: Path) => {
  switch (getPathPattern(path).at(-1)) {
    case 'd': return path.slice(0, -2)
    case 's': return path.slice(0, -2)
    case 'c': return path.slice(0, -3)
    default: return path
  }
}

// NESTED
export const getDefaultNode = (attributes?: any) => ({d: [], s: [], c: [[]], content: '', ...attributes})
